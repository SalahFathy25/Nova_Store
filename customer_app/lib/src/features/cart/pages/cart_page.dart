import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nova_core/nova_core.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:shimmer/shimmer.dart';
import '../bloc/cart_bloc.dart';
import '../bloc/cart_event.dart';
import '../bloc/cart_state.dart';
import '../../../core/router/app_router.dart';

class CartPage extends StatelessWidget {
  const CartPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<CartBloc, CartState>(
      builder: (context, state) {
        if (state is CartLoading) {
          return Scaffold(
            appBar: AppBar(title: const Text('Shopping Cart')),
            body: _buildLoadingShimmer(),
          );
        }

        if (state is CartError) {
          return Scaffold(
            appBar: AppBar(title: const Text('Shopping Cart')),
            body: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, size: 64, color: NovaTheme.grey400),
                  const SizedBox(height: 16),
                  Text(state.message, textAlign: TextAlign.center),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => context.read<CartBloc>().add(const LoadCart()),
                    child: const Text('Retry'),
                  ),
                ],
              ),
            ),
          );
        }

        if (state is CartLoaded) {
          final items = state.cart['items'] as List<dynamic>? ?? [];
          if (items.isEmpty) return _buildEmptyState(context);

          return _buildCartBody(context, state, items);
        }

        return _buildEmptyState(context);
      },
    );
  }

  Widget _buildCartBody(BuildContext context, CartLoaded state, List<dynamic> items) {
    final subtotal = state.subtotal;
    const shippingFee = 30.0;
    final total = subtotal + shippingFee;

    return Scaffold(
      backgroundColor: NovaTheme.backgroundColor,
      appBar: AppBar(
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Shopping Cart'),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: NovaTheme.primaryColor,
                borderRadius: BorderRadius.circular(NovaTheme.radiusFull),
              ),
              child: Text(
                '${items.length}',
                style: const TextStyle(color: NovaTheme.textOnPrimary, fontSize: 12, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => _showClearCartDialog(context),
            child: const Text('Clear All'),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.all(NovaTheme.spacingMd),
                itemCount: items.length,
                itemBuilder: (context, index) => _buildCartItem(context, items[index]),
              ),
            ),
            _buildCartSummary(context, items.length, subtotal, shippingFee, total),
          ],
        ),
      ),
    );
  }

  Widget _buildCartItem(BuildContext context, dynamic item) {
    final id = item['id'] ?? '';
    final productTitle = item['product_title'] ?? item['productTitle'] ?? 'Product';
    final variantTitle = item['variant_title'] ?? item['variantTitle'];
    final imageUrl = item['image_url'] ?? item['imageUrl'] ?? '';
    final quantity = item['quantity'] ?? 1;
    final unitPrice = (item['unit_price'] ?? item['unitPrice'] ?? 0).toDouble();
    final totalPrice = (item['total_price'] ?? item['totalPrice'] ?? unitPrice * quantity).toDouble();
    final stockQuantity = item['stock_quantity'] ?? item['stockQuantity'] ?? 10;

    return Dismissible(
      key: Key(id),
      direction: DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: NovaTheme.errorColor,
          borderRadius: BorderRadius.circular(NovaTheme.radiusMd),
        ),
        child: const Icon(Icons.delete_outline, color: NovaTheme.textOnPrimary, size: 28),
      ),
      onDismissed: (_) => context.read<CartBloc>().add(RemoveFromCart(itemId: id)),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: NovaTheme.surfaceColor,
          borderRadius: BorderRadius.circular(NovaTheme.radiusMd),
          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, 2))],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(NovaTheme.radiusSm),
              child: CachedNetworkImage(
                imageUrl: imageUrl,
                width: 80,
                height: 80,
                fit: BoxFit.cover,
                placeholder: (context, url) => Container(width: 80, height: 80, color: NovaTheme.dividerColor, child: const Center(child: CircularProgressIndicator(strokeWidth: 2))),
                errorWidget: (context, url, error) => Container(width: 80, height: 80, color: NovaTheme.dividerColor, child: const Icon(Icons.image_not_supported_outlined, color: NovaTheme.textHint, size: 32)),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(productTitle, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: NovaTheme.textPrimary), maxLines: 2, overflow: TextOverflow.ellipsis),
                  if (variantTitle != null) ...[const SizedBox(height: 4), Text(variantTitle, style: NovaTheme.bodySmall)],
                  const SizedBox(height: 8),
                  Text('${unitPrice.toStringAsFixed(0)} EGP', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: NovaTheme.primaryColor)),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildQuantitySelector(context, id, quantity, stockQuantity),
                      IconButton(
                        onPressed: () => context.read<CartBloc>().add(RemoveFromCart(itemId: id)),
                        icon: const Icon(Icons.delete_outline, color: NovaTheme.errorColor, size: 20),
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Align(
                    alignment: Alignment.centerRight,
                    child: Text('Total: ${totalPrice.toStringAsFixed(0)} EGP', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: NovaTheme.textPrimary)),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuantitySelector(BuildContext context, String itemId, int quantity, int stockQuantity) {
    return Container(
      decoration: BoxDecoration(
        color: NovaTheme.backgroundColor,
        borderRadius: BorderRadius.circular(NovaTheme.radiusSm),
        border: Border.all(color: NovaTheme.borderColor),
      ),
      child: Row(
        children: [
          _buildQuantityButton(
            icon: Icons.remove,
            onTap: quantity > 1
                ? () => context.read<CartBloc>().add(UpdateCartItem(itemId: itemId, quantity: quantity - 1))
                : null,
          ),
          Container(
            width: 40,
            alignment: Alignment.center,
            child: Text('$quantity', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: NovaTheme.textPrimary)),
          ),
          _buildQuantityButton(
            icon: Icons.add,
            onTap: quantity < stockQuantity
                ? () => context.read<CartBloc>().add(UpdateCartItem(itemId: itemId, quantity: quantity + 1))
                : null,
          ),
        ],
      ),
    );
  }

  Widget _buildQuantityButton({required IconData icon, VoidCallback? onTap}) {
    return InkWell(
      onTap: onTap,
      child: Container(
        width: 32,
        height: 32,
        alignment: Alignment.center,
        child: Icon(icon, size: 18, color: onTap != null ? NovaTheme.primaryColor : NovaTheme.textHint),
      ),
    );
  }

  Widget _buildCartSummary(BuildContext context, int itemCount, double subtotal, double shippingFee, double total) {
    return Container(
      padding: const EdgeInsets.all(NovaTheme.spacingMd),
      decoration: BoxDecoration(
        color: NovaTheme.surfaceColor,
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, -2))],
      ),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _buildSummaryRow('Subtotal ($itemCount items)', '${subtotal.toStringAsFixed(0)} EGP'),
            const SizedBox(height: NovaTheme.spacingSm),
            _buildSummaryRow('Shipping Fee', '${shippingFee.toStringAsFixed(0)} EGP'),
            const Padding(padding: EdgeInsets.symmetric(vertical: 8), child: Divider()),
            _buildSummaryRow('Total', '${total.toStringAsFixed(0)} EGP', isBold: true),
            const SizedBox(height: NovaTheme.spacingMd),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: () => Navigator.pushNamed(context, AppRouter.checkout),
                style: ElevatedButton.styleFrom(
                  backgroundColor: NovaTheme.primaryColor,
                  foregroundColor: NovaTheme.textOnPrimary,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(NovaTheme.radiusSm)),
                ),
                child: const Text('Proceed to Checkout', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value, {bool isBold = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: TextStyle(fontSize: isBold ? 16 : 14, fontWeight: isBold ? FontWeight.bold : FontWeight.normal, color: NovaTheme.textPrimary)),
        Text(value, style: TextStyle(fontSize: isBold ? 16 : 14, fontWeight: isBold ? FontWeight.bold : FontWeight.w600, color: NovaTheme.textPrimary)),
      ],
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Shopping Cart')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(NovaTheme.spacingLg),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 160,
                height: 160,
                decoration: const BoxDecoration(color: NovaTheme.backgroundColor, shape: BoxShape.circle),
                child: const Icon(Icons.shopping_cart_outlined, size: 80, color: NovaTheme.textHint),
              ),
              const SizedBox(height: NovaTheme.spacingLg),
              const Text('Your cart is empty', style: NovaTheme.headingMedium),
              const SizedBox(height: NovaTheme.spacingSm),
              const Text("Looks like you haven't added any items yet.\nStart exploring and find something you love!", textAlign: TextAlign.center, style: TextStyle(fontSize: 14, color: NovaTheme.textSecondary, height: 1.5)),
              const SizedBox(height: NovaTheme.spacingLg),
              SizedBox(
                width: 200,
                height: 48,
                child: ElevatedButton(
                  onPressed: () => Navigator.pushNamed(context, AppRouter.productList),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: NovaTheme.primaryColor,
                    foregroundColor: NovaTheme.textOnPrimary,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(NovaTheme.radiusSm)),
                  ),
                  child: const Text('Start Shopping', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLoadingShimmer() {
    return ListView.builder(
      padding: const EdgeInsets.all(NovaTheme.spacingMd),
      itemCount: 3,
      itemBuilder: (context, index) {
        return Shimmer.fromColors(
          baseColor: NovaTheme.grey200,
          highlightColor: NovaTheme.grey100,
          child: Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: NovaTheme.surfaceColor,
              borderRadius: BorderRadius.circular(NovaTheme.radiusMd),
            ),
            child: Row(
              children: [
                Container(width: 80, height: 80, decoration: BoxDecoration(color: NovaTheme.dividerColor, borderRadius: BorderRadius.circular(NovaTheme.radiusSm))),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(width: double.infinity, height: 14, decoration: BoxDecoration(color: NovaTheme.dividerColor, borderRadius: BorderRadius.circular(4))),
                      const SizedBox(height: 8),
                      Container(width: 100, height: 12, decoration: BoxDecoration(color: NovaTheme.dividerColor, borderRadius: BorderRadius.circular(4))),
                      const SizedBox(height: 8),
                      Container(width: 80, height: 14, decoration: BoxDecoration(color: NovaTheme.dividerColor, borderRadius: BorderRadius.circular(4))),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showClearCartDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Clear Cart'),
        content: const Text('Are you sure you want to remove all items from your cart?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(dialogContext), child: const Text('Cancel')),
          TextButton(
            onPressed: () {
              context.read<CartBloc>().add(const ClearCart());
              Navigator.pop(dialogContext);
            },
            style: TextButton.styleFrom(foregroundColor: NovaTheme.errorColor),
            child: const Text('Clear'),
          ),
        ],
      ),
    );
  }
}

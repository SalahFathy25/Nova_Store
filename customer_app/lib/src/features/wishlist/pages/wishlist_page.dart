import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nova_core/nova_core.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:shimmer/shimmer.dart';
import '../bloc/wishlist_bloc.dart';
import '../bloc/wishlist_event.dart';
import '../bloc/wishlist_state.dart';
import '../../cart/bloc/cart_bloc.dart';
import '../../cart/bloc/cart_event.dart';
import '../../../core/di/injection.dart';
import '../../../core/router/app_router.dart';
import '../../../core/utils/responsive_layout.dart';

class WishlistPage extends StatelessWidget {
  const WishlistPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<WishlistBloc>()..add(const LoadWishlist()),
      child: const _WishlistView(),
    );
  }
}

class _WishlistView extends StatelessWidget {
  const _WishlistView();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: NovaTheme.backgroundColor,
      appBar: AppBar(
        title: const Text('Wishlist'),
        actions: [
          BlocBuilder<WishlistBloc, WishlistState>(
            builder: (context, state) {
              if (state is WishlistLoaded && state.items.isNotEmpty) {
                return TextButton(
                  onPressed: () {
                    for (final item in state.items) {
                      if (item.productId.isNotEmpty) {
                        context.read<WishlistBloc>().add(RemoveFromWishlist(productId: item.productId));
                      }
                    }
                  },
                  child: const Text('Clear All', style: TextStyle(color: NovaTheme.errorColor)),
                );
              }
              return const SizedBox.shrink();
            },
          ),
        ],
      ),
      body: SafeArea(
        child: BlocBuilder<WishlistBloc, WishlistState>(
          builder: (context, state) {
            if (state is WishlistLoading) return _buildShimmerGrid(context);
            if (state is WishlistError) return Center(child: Text(state.message));
            if (state is WishlistLoaded) {
              if (state.items.isEmpty) return _buildEmptyState(context);
              return _buildContent(context, state);
            }
            return const SizedBox.shrink();
          },
        ),
      ),
    );
  }

  Widget _buildShimmerGrid(BuildContext context) {
    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: ResponsiveLayout.gridCrossAxisCount(context), childAspectRatio: 0.7, crossAxisSpacing: 12, mainAxisSpacing: 12),
      itemCount: 6,
      itemBuilder: (context, index) {
        return Shimmer.fromColors(
          baseColor: NovaTheme.grey200,
          highlightColor: NovaTheme.grey100,
          child: Container(
            decoration: BoxDecoration(color: NovaTheme.surfaceColor, borderRadius: BorderRadius.circular(12)),
          ),
        );
      },
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.favorite_border, size: 80, color: NovaTheme.textHint),
          const SizedBox(height: 16),
          const Text('Your wishlist is empty', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: NovaTheme.textPrimary)),
          const SizedBox(height: 8),
          const Text('Save items you love to your wishlist', style: TextStyle(fontSize: 14, color: NovaTheme.textSecondary)),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            style: ElevatedButton.styleFrom(
              backgroundColor: NovaTheme.primaryColor,
              foregroundColor: NovaTheme.surfaceColor,
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text('Continue Shopping'),
          ),
        ],
      ),
    );
  }

  Widget _buildContent(BuildContext context, WishlistLoaded state) {
    return RefreshIndicator(
      color: NovaTheme.primaryColor,
      onRefresh: () async => context.read<WishlistBloc>().add(const LoadWishlist()),
      child: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: ResponsiveLayout.gridCrossAxisCount(context), childAspectRatio: 0.7, crossAxisSpacing: 12, mainAxisSpacing: 12),
        itemCount: state.items.length,
        itemBuilder: (context, index) => _buildWishlistCard(context, state.items[index], index),
      ),
    );
  }

  Widget _buildWishlistCard(BuildContext context, WishlistItem item, int index) {
    return GestureDetector(
      onTap: () {
        Navigator.pushNamed(context, AppRouter.productDetail, arguments: Product(
          id: item.productId,
          tenantId: '',
          title: item.productTitle ?? '',
          slug: item.productId,
          basePrice: item.productPrice ?? 0,
        ));
      },
      child: Container(
        decoration: BoxDecoration(
          color: NovaTheme.surfaceColor,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [BoxShadow(color: NovaTheme.textHint.withValues(alpha: 0.1), blurRadius: 8, offset: const Offset(0, 2))],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Stack(
                children: [
                  Container(
                    width: double.infinity,
                    decoration: const BoxDecoration(
                      borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
                      color: NovaTheme.backgroundColor,
                    ),
                    child: ClipRRect(
                      borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                      child: item.imageUrl != null && item.imageUrl!.isNotEmpty
                          ? CachedNetworkImage(
                              imageUrl: item.imageUrl!,
                              fit: BoxFit.cover,
                              placeholder: (context, url) => const Center(child: CircularProgressIndicator(strokeWidth: 2)),
                              errorWidget: (context, url, error) => const Icon(Icons.image_outlined, size: 40, color: NovaTheme.textHint),
                            )
                          : const Icon(Icons.image_outlined, size: 40, color: NovaTheme.textHint),
                    ),
                  ),
                  Positioned(
                    top: 8,
                    right: 8,
                    child: GestureDetector(
                      onTap: () => context.read<WishlistBloc>().add(RemoveFromWishlist(productId: item.productId)),
                      child: Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: NovaTheme.surfaceColor.withValues(alpha: 0.9),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.favorite, size: 20, color: Color(0xFFFF4081)),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(item.productTitle ?? '', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: NovaTheme.textPrimary), maxLines: 2, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 4),
                  Text('EGP ${(item.productPrice ?? 0).toStringAsFixed(2)}', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: NovaTheme.primaryColor)),
                  const SizedBox(height: 4),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      onPressed: () => _moveToCart(context, item),
                      icon: const Icon(Icons.shopping_cart_outlined, size: 16),
                      label: const Text('Move to Cart', style: TextStyle(fontSize: 11)),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: NovaTheme.primaryColor,
                        side: const BorderSide(color: NovaTheme.primaryColor),
                        padding: const EdgeInsets.symmetric(vertical: 6),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _moveToCart(BuildContext context, WishlistItem item) {
    context.read<CartBloc>().add(AddToCart(
      productId: item.productId,
      quantity: 1,
    ));
    context.read<WishlistBloc>().add(RemoveFromWishlist(productId: item.productId));
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${item.productTitle} added to cart'),
        backgroundColor: NovaTheme.successColor,
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nova_core/nova_core.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:shimmer/shimmer.dart';
import '../bloc/order_bloc.dart';
import '../bloc/order_event.dart';
import '../bloc/order_state.dart';
import '../../../core/di/injection.dart';
import '../../../core/router/app_router.dart';
import '../../../core/utils/responsive_layout.dart';

class OrderListPage extends StatelessWidget {
  const OrderListPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<OrderBloc>()..add(const LoadOrders()),
      child: const _OrderListView(),
    );
  }
}

class _OrderListView extends StatelessWidget {
  const _OrderListView();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: NovaTheme.backgroundColor,
      appBar: AppBar(title: const Text('My Orders')),
      body: SafeArea(
        child: ResponsiveLayout.constrainWidth(
          context,
          child: BlocBuilder<OrderBloc, OrderState>(
            builder: (context, state) {
              if (state is OrderLoading) return _buildShimmerList();
              if (state is OrderError) return Center(child: Text(state.message));
              if (state is OrdersLoaded) {
                if (state.orders.isEmpty) return _buildEmptyState(context);
                return _buildOrderList(context, state);
              }
              return const SizedBox.shrink();
            },
          ),
        ),
      ),
    );
  }

  Widget _buildShimmerList() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: 5,
      itemBuilder: (context, index) {
        return Shimmer.fromColors(
          baseColor: NovaTheme.borderColor,
          highlightColor: NovaTheme.surfaceColor,
          child: Container(
            height: 140,
            margin: const EdgeInsets.only(bottom: 12),
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
          const Icon(Icons.shopping_bag_outlined, size: 80, color: NovaTheme.textHint),
          const SizedBox(height: 16),
          const Text('No orders found', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: NovaTheme.textPrimary)),
          const SizedBox(height: 8),
          const Text("You haven't placed any orders yet", style: TextStyle(fontSize: 14, color: NovaTheme.textSecondary)),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => Navigator.pushNamedAndRemoveUntil(context, AppRouter.root, (route) => false),
            style: ElevatedButton.styleFrom(
              backgroundColor: NovaTheme.primaryColor,
              foregroundColor: NovaTheme.surfaceColor,
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text('Start Shopping'),
          ),
        ],
      ),
    );
  }

  Widget _buildOrderList(BuildContext context, OrdersLoaded state) {
    return RefreshIndicator(
      color: NovaTheme.primaryColor,
      onRefresh: () async => context.read<OrderBloc>().add(const LoadOrders()),
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: state.orders.length,
        itemBuilder: (context, index) => _buildOrderCard(context, state.orders[index]),
      ),
    );
  }

  Widget _buildOrderCard(BuildContext context, dynamic order) {
    final orderNumber = order['order_number'] ?? order['orderNumber'] ?? '';
    final status = order['status'] ?? 'Pending';
    final grandTotal = (order['grand_total'] ?? order['grandTotal'] ?? 0).toDouble();
    final createdAt = order['created_at'] ?? order['createdAt'];
    final items = order['items'] as List<dynamic>? ?? [];
    final id = order['id'] ?? '';

    return GestureDetector(
      onTap: () => Navigator.pushNamed(context, AppRouter.orderDetail, arguments: order),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: NovaTheme.surfaceColor,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [BoxShadow(color: NovaTheme.textHint.withValues(alpha: 0.1), blurRadius: 8, offset: const Offset(0, 2))],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Order $orderNumber', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: NovaTheme.textPrimary)),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: _getStatusColor(status).withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(status, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: _getStatusColor(status))),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(_formatDate(createdAt), style: const TextStyle(fontSize: 13, color: NovaTheme.textSecondary)),
            const SizedBox(height: 12),
            Row(
              children: [
                _buildItemPreviews(items),
                const Spacer(),
                Text('EGP ${grandTotal.toStringAsFixed(2)}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: NovaTheme.textPrimary)),
              ],
            ),
            const SizedBox(height: 8),
            Text('${items.length} item${items.length > 1 ? 's' : ''}', style: const TextStyle(fontSize: 13, color: NovaTheme.textSecondary)),
          ],
        ),
      ),
    );
  }

  Widget _buildItemPreviews(List<dynamic> items) {
    final previewItems = items.take(2).toList();
    return SizedBox(
      height: 40,
      width: 80,
      child: Stack(
        children: [
          for (int i = 0; i < previewItems.length; i++)
            Positioned(
              left: i * 20.0,
              child: Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: NovaTheme.surfaceColor, width: 2),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(6),
                  child: _buildItemImage(previewItems[i]),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildItemImage(dynamic item) {
    final images = item['images'] as List<dynamic>? ?? [];
    final imageUrl = images.isNotEmpty ? (images[0]['url'] ?? '') : '';
    if (imageUrl.toString().isEmpty) {
      return Container(color: NovaTheme.borderColor, child: const Icon(Icons.image_outlined, size: 20, color: NovaTheme.textHint));
    }
    return CachedNetworkImage(
      imageUrl: imageUrl,
      fit: BoxFit.cover,
      placeholder: (context, url) => Container(color: NovaTheme.borderColor, child: const Icon(Icons.image_outlined, size: 20, color: NovaTheme.textHint)),
      errorWidget: (context, url, error) => Container(color: NovaTheme.borderColor, child: const Icon(Icons.image_outlined, size: 20, color: NovaTheme.textHint)),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return NovaTheme.warningColor;
      case 'processing':
        return const Color(0xFF2196F3);
      case 'delivered':
        return NovaTheme.successColor;
      case 'cancelled':
        return NovaTheme.errorColor;
      default:
        return NovaTheme.textSecondary;
    }
  }

  String _formatDate(dynamic timestamp) {
    if (timestamp == null) return '';
    try {
      final date = DateTime.parse(timestamp.toString());
      final now = DateTime.now();
      final difference = now.difference(date);
      if (difference.inDays == 0) return 'Today';
      if (difference.inDays == 1) return 'Yesterday';
      if (difference.inDays < 7) return '${difference.inDays} days ago';
      return '${date.day}/${date.month}/${date.year}';
    } catch (e) {
      return '';
    }
  }
}

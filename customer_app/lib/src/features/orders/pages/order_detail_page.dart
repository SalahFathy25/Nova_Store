import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nova_core/nova_core.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../core/utils/responsive_layout.dart';
import '../../cart/bloc/cart_bloc.dart';
import '../../cart/bloc/cart_event.dart';
import '../bloc/order_bloc.dart';
import '../bloc/order_event.dart';

class OrderDetailPage extends StatelessWidget {
  final Order order;

  const OrderDetailPage({super.key, required this.order});

  Color _getStatusColor(String status) {
    switch (status) {
      case 'Pending':
        return NovaTheme.warningColor;
      case 'Confirmed':
        return NovaTheme.warningColor;
      case 'Processing':
        return const Color(0xFF2196F3);
      case 'Shipped':
        return const Color(0xFF9C27B0);
      case 'Delivered':
        return NovaTheme.successColor;
      case 'Cancelled':
        return NovaTheme.errorColor;
      default:
        return NovaTheme.textSecondary;
    }
  }

  IconData _getStatusIcon(String status) {
    switch (status) {
      case 'Pending':
        return Icons.schedule;
      case 'Confirmed':
        return Icons.check_circle_outline;
      case 'Processing':
        return Icons.autorenew;
      case 'Shipped':
        return Icons.local_shipping_outlined;
      case 'Delivered':
        return Icons.check_circle;
      case 'Cancelled':
        return Icons.cancel_outlined;
      default:
        return Icons.circle;
    }
  }

  @override
  Widget build(BuildContext context) {
    final canCancel = order.status == 'Pending' || order.status == 'Confirmed';

    return Scaffold(
      backgroundColor: NovaTheme.backgroundColor,
      appBar: AppBar(
        title: Text('Order ${order.orderNumber}'),
      ),
      body: SafeArea(
        child: ResponsiveLayout.constrainWidth(
          context,
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildOrderHeader(),
                _buildStatusTimeline(),
                _buildItemsList(),
                _buildPriceBreakdown(),
                _buildShippingAddress(),
                _buildPaymentMethod(),
                if (canCancel) _buildCancelSection(context),
                if (order.status == 'Delivered' || order.status == 'Cancelled') _buildReorderSection(context),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildOrderHeader() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      color: NovaTheme.surfaceColor,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Order ${order.orderNumber}',
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: NovaTheme.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _formatDate(order.createdAt),
                    style: const TextStyle(
                      fontSize: 14,
                      color: NovaTheme.textSecondary,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: _getStatusColor(order.status).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Text(
                  order.status,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: _getStatusColor(order.status),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatusTimeline() {
    final steps = _buildTimelineSteps();

    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(top: 8),
      padding: const EdgeInsets.all(16),
      color: NovaTheme.surfaceColor,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Order Status',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: NovaTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 16),
          ...steps.asMap().entries.map((entry) {
            final index = entry.key;
            final step = entry.value;
            final isLast = index == steps.length - 1;
            final isCompleted = step['completed'] as bool;
            final isCurrent = step['current'] as bool;

            return _buildTimelineStep(
              title: step['title'] as String,
              date: step['date'] as String?,
              note: step['note'] as String?,
              isLast: isLast,
              isCompleted: isCompleted,
              isCurrent: isCurrent,
              color: isCompleted || isCurrent
                  ? _getStatusColor(step['title'] as String)
                  : NovaTheme.borderColor,
            );
          }),
        ],
      ),
    );
  }

  List<Map<String, dynamic>> _buildTimelineSteps() {
    final allSteps = [
      'Pending',
      'Confirmed',
      'Processing',
      'Shipped',
      'Delivered',
    ];

    final statusIndex = allSteps.indexOf(order.status);
    final isCancelled = order.status == 'Cancelled';

    if (isCancelled) {
      return [
        {
          'title': 'Pending',
          'date': _formatDate(order.createdAt),
          'note': null,
          'completed': true,
          'current': false,
        },
        {
          'title': 'Cancelled',
          'date': _formatDate(order.createdAt),
          'note': 'Order was cancelled',
          'completed': false,
          'current': true,
        },
      ];
    }

    return List.generate(allSteps.length, (index) {
      final event = order.statusHistory.where((e) => e.status == allSteps[index]).firstOrNull;
      return {
        'title': allSteps[index],
        'date': event != null ? _formatDate(event.createdAt) : (index <= statusIndex ? _formatDate(order.createdAt) : null),
        'note': event?.note,
        'completed': index < statusIndex,
        'current': index == statusIndex,
      };
    });
  }

  Widget _buildTimelineStep({
    required String title,
    required String? date,
    required String? note,
    required bool isLast,
    required bool isCompleted,
    required bool isCurrent,
    required Color color,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isCompleted || isCurrent ? color : NovaTheme.borderColor,
                border: Border.all(
                  color: isCompleted || isCurrent ? color : NovaTheme.borderColor,
                  width: 2,
                ),
              ),
              child: isCompleted
                  ? const Icon(Icons.check, size: 14, color: NovaTheme.surfaceColor)
                  : isCurrent
                      ? Icon(_getStatusIcon(title), size: 12, color: NovaTheme.surfaceColor)
                      : null,
            ),
            if (!isLast)
              Container(
                width: 2,
                height: 40,
                color: isCompleted ? color : NovaTheme.borderColor,
              ),
          ],
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: isCurrent ? FontWeight.bold : FontWeight.w500,
                    color: isCompleted || isCurrent
                        ? NovaTheme.textPrimary
                        : NovaTheme.textHint,
                  ),
                ),
                if (date != null) ...[
                  const SizedBox(height: 2),
                  Text(
                    date,
                    style: const TextStyle(
                      fontSize: 12,
                      color: NovaTheme.textSecondary,
                    ),
                  ),
                ],
                if (note != null) ...[
                  const SizedBox(height: 4),
                  Text(
                    note,
                    style: const TextStyle(
                      fontSize: 12,
                      color: NovaTheme.textSecondary,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildItemsList() {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(top: 8),
      padding: const EdgeInsets.all(16),
      color: NovaTheme.surfaceColor,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Order Items',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: NovaTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 12),
          ...order.items.map((item) => _buildOrderItem(item)),
        ],
      ),
    );
  }

  Widget _buildOrderItem(OrderItem item) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(8),
              color: NovaTheme.backgroundColor,
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: item.imageUrl != null
                  ? CachedNetworkImage(
                      imageUrl: item.imageUrl!,
                      fit: BoxFit.cover,
                      placeholder: (context, url) => const Center(
                        child: CircularProgressIndicator(strokeWidth: 2),
                      ),
                      errorWidget: (context, url, error) => const Icon(
                        Icons.image_outlined,
                        color: NovaTheme.textHint,
                      ),
                    )
                  : const Icon(
                      Icons.image_outlined,
                      color: NovaTheme.textHint,
                    ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.productTitle,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: NovaTheme.textPrimary,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  'Qty: ${item.quantity}',
                  style: const TextStyle(
                    fontSize: 13,
                    color: NovaTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          Text(
            'EGP ${(item.unitPrice * item.quantity).toStringAsFixed(2)}',
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: NovaTheme.textPrimary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPriceBreakdown() {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(top: 8),
      padding: const EdgeInsets.all(16),
      color: NovaTheme.surfaceColor,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Price Details',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: NovaTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 12),
          _buildPriceRow('Subtotal', order.subtotal),
          _buildPriceRow('Shipping', order.shippingFee),
          _buildPriceRow('Tax', order.taxAmount),
          if (order.discountAmount > 0) ...[
            _buildPriceRow('Discount', -order.discountAmount, isDiscount: true),
          ],
          if (order.couponDiscount > 0) ...[
            _buildPriceRow('Coupon (${order.couponCode})', -order.couponDiscount, isDiscount: true),
          ],
          const Divider(color: NovaTheme.borderColor),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Total',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: NovaTheme.textPrimary,
                ),
              ),
              Text(
                'EGP ${order.grandTotal.toStringAsFixed(2)}',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: NovaTheme.primaryColor,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPriceRow(String label, double amount, {bool isDiscount = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 14,
              color: NovaTheme.textSecondary,
            ),
          ),
          Text(
            '${isDiscount ? '-' : ''}EGP ${amount.abs().toStringAsFixed(2)}',
            style: TextStyle(
              fontSize: 14,
              color: isDiscount ? NovaTheme.successColor : NovaTheme.textPrimary,
              fontWeight: isDiscount ? FontWeight.w500 : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildShippingAddress() {
    final address = order.shippingAddress;
    if (address == null) return const SizedBox.shrink();

    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(top: 8),
      padding: const EdgeInsets.all(16),
      color: NovaTheme.surfaceColor,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: const [
              Icon(Icons.location_on_outlined, size: 20, color: NovaTheme.primaryColor),
              SizedBox(width: 8),
              Text(
                'Shipping Address',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: NovaTheme.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            address['full_address'] ?? '',
            style: const TextStyle(
              fontSize: 14,
              color: NovaTheme.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentMethod() {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(top: 8),
      padding: const EdgeInsets.all(16),
      color: NovaTheme.surfaceColor,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: const [
              Icon(Icons.payment_outlined, size: 20, color: NovaTheme.primaryColor),
              SizedBox(width: 8),
              Text(
                'Payment Method',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: NovaTheme.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            _getPaymentMethodLabel(order.paymentMethod),
            style: const TextStyle(
              fontSize: 14,
              color: NovaTheme.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  String _getPaymentMethodLabel(String method) {
    switch (method) {
      case 'cod':
        return 'Cash on Delivery';
      case 'card':
        return 'Credit/Debit Card';
      case 'wallet':
        return 'Mobile Wallet';
      case 'fawry':
        return 'Fawry';
      default:
        return method.toUpperCase();
    }
  }

  Widget _buildCancelSection(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(top: 8),
      padding: const EdgeInsets.all(16),
      color: NovaTheme.surfaceColor,
      child: OutlinedButton(
        onPressed: () => _showCancelDialog(context),
        style: OutlinedButton.styleFrom(
          foregroundColor: NovaTheme.errorColor,
          side: const BorderSide(color: NovaTheme.errorColor),
          padding: const EdgeInsets.symmetric(vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
        child: const Text('Cancel Order'),
      ),
    );
  }

  Widget _buildReorderSection(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(top: 8),
      padding: const EdgeInsets.all(16),
      color: NovaTheme.surfaceColor,
      child: ElevatedButton(
        onPressed: () => _handleReorder(context),
        style: ElevatedButton.styleFrom(
          backgroundColor: NovaTheme.primaryColor,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
        child: const Text('Reorder'),
      ),
    );
  }

  void _handleReorder(BuildContext context) {
    final cartBloc = context.read<CartBloc>();
    for (final item in order.items) {
      cartBloc.add(AddToCart(
        productId: item.productId,
        variantId: item.productVariantId,
        quantity: item.quantity,
      ));
    }
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${order.items.length} item(s) added to cart'),
        backgroundColor: NovaTheme.successColor,
      ),
    );
    Navigator.pushNamed(context, '/cart');
  }

  void _showCancelDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Cancel Order'),
        content: const Text('Are you sure you want to cancel this order?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              'No',
              style: TextStyle(color: NovaTheme.textSecondary),
            ),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              context.read<OrderBloc>().add(CancelOrder(orderId: order.id));
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: const Text('Order cancellation requested'),
                  backgroundColor: NovaTheme.successColor,
                ),
              );
            },
            child: const Text(
              'Yes, Cancel',
              style: TextStyle(color: NovaTheme.errorColor),
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime? date) {
    if (date == null) return '';
    final months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return '${date.day} ${months[date.month - 1]} ${date.year}';
  }
}

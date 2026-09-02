import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:nova_core/nova_core.dart';
import '../../providers/order_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../otp/otp_verification_screen.dart';

class OrderDetailScreen extends StatelessWidget {
  const OrderDetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final orderProvider = context.watch<OrderProvider>();
    final order = orderProvider.selectedOrder;

    if (order == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Order Details')),
        body: const Center(child: Text('No order selected')),
      );
    }

    final parentOrder = order.parentOrder;
    final shippingAddress = parentOrder?['shipping_address'] as Map<String, dynamic>?;

    return Scaffold(
      appBar: AppBar(
        title: Text('Order #${parentOrder?['order_number'] ?? order.id.substring(0, 8)}'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildStatusSection(order),
            const SizedBox(height: 16),
            _buildAddressSection(shippingAddress),
            const SizedBox(height: 16),
            _buildOrderInfo(order),
            const SizedBox(height: 16),
            if (order.deliveryStatus == 'Assigned') _buildActionButtons(context, order),
            if (order.deliveryStatus == 'Picked Up') _buildNavigationButton(context, order),
            if (order.deliveryStatus == 'On The Way') _buildDeliverButton(context, order),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusSection(DeliveryOrder order) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Delivery Status', style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Row(
              children: [
                _buildStatusStep('Assigned', order.deliveryStatus == 'Assigned' || order.deliveryStatus == 'Picked Up' || order.deliveryStatus == 'On The Way' || order.deliveryStatus == 'Delivered'),
                _buildStatusConnector(),
                _buildStatusStep('Picked Up', order.deliveryStatus == 'Picked Up' || order.deliveryStatus == 'On The Way' || order.deliveryStatus == 'Delivered'),
                _buildStatusConnector(),
                _buildStatusStep('On The Way', order.deliveryStatus == 'On The Way' || order.deliveryStatus == 'Delivered'),
                _buildStatusConnector(),
                _buildStatusStep('Delivered', order.deliveryStatus == 'Delivered'),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusStep(String label, bool isActive) {
    return Column(
      children: [
        Container(
          width: 24,
          height: 24,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: isActive ? AppTheme.successColor : Colors.grey.shade300,
          ),
          child: isActive
              ? const Icon(Icons.check, size: 16, color: Colors.white)
              : null,
        ),
        const SizedBox(height: 4),
        Text(label, style: TextStyle(fontSize: 10, color: isActive ? AppTheme.primaryColor : AppTheme.textSecondary)),
      ],
    );
  }

  Widget _buildStatusConnector() {
    return Expanded(
      child: Container(
        height: 2,
        color: Colors.grey.shade300,
        margin: const EdgeInsets.only(bottom: 20),
      ),
    );
  }

  Widget _buildAddressSection(Map<String, dynamic>? address) {
    if (address == null) return const SizedBox.shrink();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.location_on, color: AppTheme.errorColor, size: 20),
                SizedBox(width: 8),
                Text('Delivery Address', style: TextStyle(fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 8),
            Text(address['address_line1'] ?? ''),
            if (address['address_line2'] != null) Text(address['address_line2']),
            Text('${address['city'] ?? ''}, ${address['governorate'] ?? ''}'),
            if (address['phone'] != null) Text('Phone: ${address['phone']}'),
          ],
        ),
      ),
    );
  }

  Widget _buildOrderInfo(DeliveryOrder order) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Order Info', style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            _buildInfoRow('Payment Method', order.parentOrder?['payment_method'] ?? 'COD'),
            _buildInfoRow('Payment Status', order.paymentStatus),
            _buildInfoRow('Subtotal', '${order.subtotal.toStringAsFixed(2)} EGP'),
            _buildInfoRow('Delivery Fee', '${order.deliveryFee.toStringAsFixed(2)} EGP'),
            const Divider(),
            _buildInfoRow('Total', '${order.netAmount.toStringAsFixed(2)} EGP', isBold: true),
            if (order.deliveryOtp != null && order.deliveryStatus != 'Delivered') ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.secondaryColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.lock, size: 20, color: AppTheme.secondaryColor),
                    const SizedBox(width: 8),
                    Text('OTP: ${order.deliveryOtp}', style: const TextStyle(fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, {bool isBold = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(color: AppTheme.textSecondary)),
          Text(
            value,
            style: TextStyle(fontWeight: isBold ? FontWeight.bold : FontWeight.normal),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons(BuildContext context, DeliveryOrder order) {
    return Row(
      children: [
        Expanded(
          child: OutlinedButton.icon(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => OtpVerificationScreen(order: order)),
              );
            },
            icon: const Icon(Icons.lock_open),
            label: const Text('Verify OTP'),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: ElevatedButton.icon(
            onPressed: () async {
              final provider = context.read<OrderProvider>();
              final success = await provider.updateOrderStatus(order.id, 'Picked Up');
              if (success && context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Order picked up'), backgroundColor: AppTheme.successColor),
                );
              }
            },
            icon: const Icon(Icons.check),
            label: const Text('Pick Up'),
          ),
        ),
      ],
    );
  }

  Widget _buildNavigationButton(BuildContext context, DeliveryOrder order) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        onPressed: () {
          // TODO: Open Google Maps navigation
        },
        icon: const Icon(Icons.navigation),
        label: const Text('Navigate to Customer'),
        style: ElevatedButton.styleFrom(backgroundColor: Colors.blue),
      ),
    );
  }

  Widget _buildDeliverButton(BuildContext context, DeliveryOrder order) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => OtpVerificationScreen(order: order)),
          );
        },
        icon: const Icon(Icons.check_circle),
        label: const Text('Complete Delivery'),
        style: ElevatedButton.styleFrom(backgroundColor: AppTheme.successColor),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:nova_core/nova_core.dart';
import '../../providers/order_provider.dart';
import '../../../core/theme/app_theme.dart';

class UnassignedOrdersScreen extends StatefulWidget {
  const UnassignedOrdersScreen({super.key});

  @override
  State<UnassignedOrdersScreen> createState() => _UnassignedOrdersScreenState();
}

class _UnassignedOrdersScreenState extends State<UnassignedOrdersScreen> {
  @override
  void initState() {
    super.initState();
    context.read<OrderProvider>().loadUnassignedOrders();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Available Orders'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => context.read<OrderProvider>().loadUnassignedOrders(),
          ),
        ],
      ),
      body: Consumer<OrderProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (provider.orders.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.inbox_outlined, size: 64, color: AppTheme.textSecondary),
                  SizedBox(height: 16),
                  Text('No available orders', style: TextStyle(color: AppTheme.textSecondary)),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () async => context.read<OrderProvider>().loadUnassignedOrders(),
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: provider.orders.length,
              itemBuilder: (context, index) {
                final order = provider.orders[index];
                return _buildOrderCard(order);
              },
            ),
          );
        },
      ),
    );
  }

  Widget _buildOrderCard(DeliveryOrder order) {
    final parentOrder = order.parentOrder;
    final shippingAddress = parentOrder?['shipping_address'] as Map<String, dynamic>?;

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Order #${parentOrder?['order_number'] ?? order.id.substring(0, 8)}',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.orange.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Text(
                    'Available',
                    style: TextStyle(color: Colors.orange, fontWeight: FontWeight.w600, fontSize: 12),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            if (shippingAddress != null) ...[
              Row(
                children: [
                  const Icon(Icons.location_on_outlined, size: 16, color: AppTheme.textSecondary),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      '${shippingAddress['address_line1'] ?? ''} ${shippingAddress['city'] ?? ''}',
                      style: TextStyle(color: AppTheme.textSecondary, fontSize: 13),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ],
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Cash: ${(order.netAmount).toStringAsFixed(2)} EGP',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: AppTheme.secondaryColor,
                    fontSize: 14,
                  ),
                ),
                ElevatedButton(
                  onPressed: () async {
                    // TODO: Implement self-assignment or show assign dialog
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Contact admin to assign this order')),
                    );
                  },
                  child: const Text('Accept'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

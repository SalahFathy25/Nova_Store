import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:nova_core/nova_core.dart';
import '../../providers/order_provider.dart';
import '../../../core/theme/app_theme.dart';
import 'order_detail_screen.dart';

class OrderListScreen extends StatefulWidget {
  const OrderListScreen({super.key});

  @override
  State<OrderListScreen> createState() => _OrderListScreenState();
}

class _OrderListScreenState extends State<OrderListScreen> {
  String _selectedStatus = '';

  @override
  void initState() {
    super.initState();
    _loadOrders();
  }

  void _loadOrders() {
    context.read<OrderProvider>().loadMyOrders(status: _selectedStatus.isEmpty ? null : _selectedStatus);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Orders'),
        actions: [
          PopupMenuButton<String>(
            onSelected: (value) {
              setState(() => _selectedStatus = value == 'All' ? '' : value);
              _loadOrders();
            },
            itemBuilder: (context) => [
              const PopupMenuItem(value: 'All', child: Text('All')),
              const PopupMenuItem(value: 'Assigned', child: Text('Assigned')),
              const PopupMenuItem(value: 'Picked Up', child: Text('Picked Up')),
              const PopupMenuItem(value: 'On The Way', child: Text('On The Way')),
              const PopupMenuItem(value: 'Delivered', child: Text('Delivered')),
              const PopupMenuItem(value: 'Failed', child: Text('Failed')),
            ],
          ),
        ],
      ),
      body: Consumer<OrderProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (provider.myOrders.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.inbox_outlined, size: 64, color: AppTheme.textSecondary),
                  SizedBox(height: 16),
                  Text('No orders found', style: TextStyle(color: AppTheme.textSecondary)),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () async => _loadOrders(),
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: provider.myOrders.length,
              itemBuilder: (context, index) {
                final order = provider.myOrders[index];
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
      child: InkWell(
        onTap: () {
          context.read<OrderProvider>().selectOrder(order);
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const OrderDetailScreen()),
          );
        },
        borderRadius: BorderRadius.circular(12),
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
                  _buildStatusChip(order.deliveryStatus),
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
                const SizedBox(height: 4),
              ],
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
                  if (order.createdAt != null)
                    Text(
                      DateFormat('MMM d, h:mm a').format(order.createdAt!),
                      style: TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatusChip(String status) {
    Color color;
    switch (status) {
      case 'Delivered':
        color = AppTheme.successColor;
        break;
      case 'Failed':
        color = AppTheme.errorColor;
        break;
      case 'On The Way':
        color = Colors.blue;
        break;
      case 'Picked Up':
        color = Colors.orange;
        break;
      default:
        color = AppTheme.textSecondary;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Text(
        status,
        style: TextStyle(color: color, fontWeight: FontWeight.w600, fontSize: 12),
      ),
    );
  }
}

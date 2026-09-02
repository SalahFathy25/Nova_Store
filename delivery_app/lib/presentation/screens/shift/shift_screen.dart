import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../providers/shift_provider.dart';
import '../../../core/theme/app_theme.dart';

class ShiftScreen extends StatelessWidget {
  const ShiftScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Shift Management')),
      body: Consumer<ShiftProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          return Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                _buildCurrentShiftCard(provider),
                const SizedBox(height: 16),
                _buildShiftStats(provider),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildCurrentShiftCard(ShiftProvider provider) {
    final shift = provider.activeShift;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: provider.isOnline ? AppTheme.successColor : Colors.grey.shade300,
              ),
              child: Icon(
                Icons.local_shipping,
                size: 40,
                color: provider.isOnline ? Colors.white : Colors.grey,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              provider.isOnline ? 'You are Online' : 'You are Offline',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: provider.isOnline ? AppTheme.successColor : AppTheme.textSecondary,
              ),
            ),
            if (shift != null) ...[
              const SizedBox(height: 8),
              Text(
                'Started: ${DateFormat('MMM d, h:mm a').format(shift.startedAt)}',
                style: TextStyle(color: AppTheme.textSecondary),
              ),
            ],
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: provider.isLoading
                    ? null
                    : () async {
                        if (provider.isOnline) {
                          await provider.endShift();
                        } else {
                          await provider.startShift();
                        }
                      },
                style: ElevatedButton.styleFrom(
                  backgroundColor: provider.isOnline ? AppTheme.errorColor : AppTheme.successColor,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: Text(
                  provider.isOnline ? 'End Shift' : 'Start Shift',
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildShiftStats(ShiftProvider provider) {
    final shift = provider.activeShift;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Shift Statistics',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 16),
            _buildStatRow('Total Orders', '${shift?.totalOrders ?? 0}', Icons.shopping_bag),
            const Divider(),
            _buildStatRow('Delivered', '${shift?.totalDelivered ?? 0}', Icons.check_circle),
            const Divider(),
            _buildStatRow('Failed', '${shift?.totalFailed ?? 0}', Icons.cancel),
            const Divider(),
            _buildStatRow('Earnings', '${shift?.totalEarnings ?? 0} EGP', Icons.attach_money),
          ],
        ),
      ),
    );
  }

  Widget _buildStatRow(String label, String value, IconData icon) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(icon, color: AppTheme.secondaryColor, size: 24),
          const SizedBox(width: 12),
          Expanded(child: Text(label, style: const TextStyle(fontSize: 16))),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        ],
      ),
    );
  }
}

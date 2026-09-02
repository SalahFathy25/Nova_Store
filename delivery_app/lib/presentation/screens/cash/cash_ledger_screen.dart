import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:nova_core/nova_core.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/di/injection.dart';

class CashLedgerScreen extends StatefulWidget {
  const CashLedgerScreen({super.key});

  @override
  State<CashLedgerScreen> createState() => _CashLedgerScreenState();
}

class _CashLedgerScreenState extends State<CashLedgerScreen> {
  List<CashLedgerEntry> _ledgerEntries = [];
  CashSummary _summary = const CashSummary();
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      final dataSource = context.read<DeliveryRemoteDataSource>();
      final ledgerResponse = await dataSource.getCashLedger();
      final summaryResponse = await dataSource.getCashSummary();

      setState(() {
        _ledgerEntries = (ledgerResponse.data as List?)
                ?.map((e) => CashLedgerEntry.fromJson(e))
                .toList() ??
            [];
        _summary = CashSummary.fromJson(summaryResponse.data!);
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cash Ledger'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadData,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSummaryCard(),
                  const SizedBox(height: 16),
                  _buildSubmitCashButton(),
                  const SizedBox(height: 16),
                  const Text(
                    'Transaction History',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  const SizedBox(height: 8),
                  _buildLedgerList(),
                ],
              ),
            ),
    );
  }

  Widget _buildSummaryCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            const Text(
              'Cash Summary',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                _buildSummaryItem('Total Earnings', _summary.totalEarnings, AppTheme.secondaryColor),
                _buildSummaryItem('Collected', _summary.totalCollected, AppTheme.successColor),
                _buildSummaryItem('Pending', _summary.pendingSubmissions, AppTheme.errorColor),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryItem(String label, double amount, Color color) {
    return Expanded(
      child: Column(
        children: [
          Text(
            '${amount.toStringAsFixed(0)} EGP',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: AppTheme.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSubmitCashButton() {
    return SizedBox(
      width: double.infinity,
      child: OutlinedButton.icon(
        onPressed: () => _showSubmitCashDialog(),
        icon: const Icon(Icons.account_balance_wallet),
        label: const Text('Submit Cash'),
      ),
    );
  }

  void _showSubmitCashDialog() {
    final controller = TextEditingController();
    final notesController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Submit Cash'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: controller,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Amount (EGP)',
                prefixIcon: Icon(Icons.attach_money),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: notesController,
              decoration: const InputDecoration(
                labelText: 'Notes (optional)',
                prefixIcon: Icon(Icons.note),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              final amount = double.tryParse(controller.text);
              if (amount != null && amount > 0) {
                Navigator.pop(context);
                try {
      final dataSource = getIt<DeliveryRemoteDataSource>();
                  await dataSource.submitCash(amount, notes: notesController.text);
                  _loadData();
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Cash submitted successfully'),
                        backgroundColor: AppTheme.successColor,
                      ),
                    );
                  }
                } catch (e) {
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Failed: $e'),
                        backgroundColor: AppTheme.errorColor,
                      ),
                    );
                  }
                }
              }
            },
            child: const Text('Submit'),
          ),
        ],
      ),
    );
  }

  Widget _buildLedgerList() {
    if (_ledgerEntries.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(32),
          child: Text('No transactions yet', style: TextStyle(color: AppTheme.textSecondary)),
        ),
      );
    }

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: _ledgerEntries.length,
      itemBuilder: (context, index) {
        final entry = _ledgerEntries[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: entry.type == 'collected' ? AppTheme.successColor : AppTheme.secondaryColor,
              child: Icon(
                entry.type == 'collected' ? Icons.arrow_downward : Icons.arrow_upward,
                color: Colors.white,
              ),
            ),
            title: Text(
              '${entry.amount.toStringAsFixed(2)} EGP',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            subtitle: Text(
              entry.notes ?? entry.type.toUpperCase(),
              style: TextStyle(color: AppTheme.textSecondary, fontSize: 12),
            ),
            trailing: Text(
              DateFormat('MMM d, h:mm a').format(entry.createdAt),
              style: TextStyle(color: AppTheme.textSecondary, fontSize: 12),
            ),
          ),
        );
      },
    );
  }
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/shift_provider.dart';
import '../../providers/order_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../orders/order_list_screen.dart';
import '../orders/unassigned_orders_screen.dart';
import '../cash/cash_ledger_screen.dart';
import '../profile/profile_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  void _loadData() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ShiftProvider>().loadActiveShift();
      context.read<OrderProvider>().loadMyOrders();
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final shift = context.watch<ShiftProvider>();

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: [
          _buildHomeTab(auth, shift),
          const OrderListScreen(),
          const UnassignedOrdersScreen(),
          const CashLedgerScreen(),
          const ProfileScreen(),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() => _currentIndex = index);
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.list_alt_outlined),
            selectedIcon: Icon(Icons.list_alt),
            label: 'My Orders',
          ),
          NavigationDestination(
            icon: Icon(Icons.assignment_outlined),
            selectedIcon: Icon(Icons.assignment),
            label: 'Available',
          ),
          NavigationDestination(
            icon: Icon(Icons.account_balance_wallet_outlined),
            selectedIcon: Icon(Icons.account_balance_wallet),
            label: 'Cash',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outlined),
            selectedIcon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }

  Widget _buildHomeTab(AuthProvider auth, ShiftProvider shift) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 24,
                  backgroundColor: AppTheme.secondaryColor,
                  child: Text(
                    (auth.driver?.fullName ?? 'D')[0].toUpperCase(),
                    style: const TextStyle(
                      color: AppTheme.primaryColor,
                      fontWeight: FontWeight.bold,
                      fontSize: 20,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Hello, ${auth.driver?.fullName ?? 'Driver'}!',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                      ),
                      Text(
                        shift.isOnline ? 'Online' : 'Offline',
                        style: TextStyle(
                          color: shift.isOnline ? AppTheme.successColor : AppTheme.textSecondary,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            _buildShiftCard(shift),
            const SizedBox(height: 16),
            _buildStatsCards(shift),
            const SizedBox(height: 16),
            _buildQuickActions(),
          ],
        ),
      ),
    );
  }

  Widget _buildShiftCard(ShiftProvider shift) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Shift Status',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  decoration: BoxDecoration(
                    color: shift.isOnline ? AppTheme.successColor : AppTheme.textSecondary,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    shift.isOnline ? 'ONLINE' : 'OFFLINE',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: shift.isLoading
                    ? null
                    : () async {
                        if (shift.isOnline) {
                          await shift.endShift();
                        } else {
                          await shift.startShift();
                        }
                      },
                style: ElevatedButton.styleFrom(
                  backgroundColor: shift.isOnline ? AppTheme.errorColor : AppTheme.successColor,
                ),
                child: shift.isLoading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                      )
                    : Text(shift.isOnline ? 'End Shift' : 'Start Shift'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatsCards(ShiftProvider shift) {
    final s = shift.activeShift;
    return Row(
      children: [
        _buildStatCard('Orders', '${s?.totalOrders ?? 0}', Icons.shopping_bag_outlined),
        const SizedBox(width: 8),
        _buildStatCard('Delivered', '${s?.totalDelivered ?? 0}', Icons.check_circle_outline),
        const SizedBox(width: 8),
        _buildStatCard('Earnings', '${s?.totalEarnings ?? 0} EGP', Icons.attach_money),
      ],
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon) {
    return Expanded(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            children: [
              Icon(icon, color: AppTheme.secondaryColor, size: 28),
              const SizedBox(height: 8),
              Text(
                value,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              Text(
                label,
                style: TextStyle(color: AppTheme.textSecondary, fontSize: 12),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildQuickActions() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Quick Actions',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            _buildActionCard('Navigate', Icons.navigation, () {}),
            const SizedBox(width: 8),
            _buildActionCard('Cash Ledger', Icons.account_balance_wallet, () {}),
            const SizedBox(width: 8),
            _buildActionCard('Profile', Icons.person, () {}),
          ],
        ),
      ],
    );
  }

  Widget _buildActionCard(String label, IconData icon, VoidCallback onTap) {
    return Expanded(
      child: Card(
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Icon(icon, color: AppTheme.primaryColor, size: 32),
                const SizedBox(height: 8),
                Text(
                  label,
                  style: const TextStyle(fontSize: 12),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

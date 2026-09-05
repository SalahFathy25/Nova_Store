import 'package:flutter/material.dart';
import 'package:nova_core/nova_core.dart';
import 'package:shared_preferences/shared_preferences.dart';

class NotificationPreferencesPage extends StatefulWidget {
  const NotificationPreferencesPage({super.key});

  @override
  State<NotificationPreferencesPage> createState() => _NotificationPreferencesPageState();
}

class _NotificationPreferencesPageState extends State<NotificationPreferencesPage> {
  bool _orderUpdates = true;
  bool _promotions = true;
  bool _newArrivals = false;
  bool _priceDrops = true;
  bool _backInStock = true;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadPreferences();
  }

  Future<void> _loadPreferences() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _orderUpdates = prefs.getBool('notif_order_updates') ?? true;
      _promotions = prefs.getBool('notif_promotions') ?? true;
      _newArrivals = prefs.getBool('notif_new_arrivals') ?? false;
      _priceDrops = prefs.getBool('notif_price_drops') ?? true;
      _backInStock = prefs.getBool('notif_back_in_stock') ?? true;
      _isLoading = false;
    });
  }

  Future<void> _savePreference(String key, bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(key, value);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: NovaTheme.backgroundColor,
      appBar: AppBar(title: const Text('Notification Preferences')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: NovaTheme.primaryColor))
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                _buildSection(
                  title: 'Order Notifications',
                  children: [
                    _buildSwitchTile(
                      title: 'Order Updates',
                      subtitle: 'Get notified about order status changes',
                      value: _orderUpdates,
                      onChanged: (v) {
                        setState(() => _orderUpdates = v);
                        _savePreference('notif_order_updates', v);
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                _buildSection(
                  title: 'Marketing',
                  children: [
                    _buildSwitchTile(
                      title: 'Promotions & Deals',
                      subtitle: 'Receive promotional offers and discounts',
                      value: _promotions,
                      onChanged: (v) {
                        setState(() => _promotions = v);
                        _savePreference('notif_promotions', v);
                      },
                    ),
                    _buildSwitchTile(
                      title: 'New Arrivals',
                      subtitle: 'Be the first to know about new products',
                      value: _newArrivals,
                      onChanged: (v) {
                        setState(() => _newArrivals = v);
                        _savePreference('notif_new_arrivals', v);
                      },
                    ),
                    _buildSwitchTile(
                      title: 'Price Drops',
                      subtitle: 'Get notified when wishlist items go on sale',
                      value: _priceDrops,
                      onChanged: (v) {
                        setState(() => _priceDrops = v);
                        _savePreference('notif_price_drops', v);
                      },
                    ),
                    _buildSwitchTile(
                      title: 'Back in Stock',
                      subtitle: 'Know when out-of-stock items are available again',
                      value: _backInStock,
                      onChanged: (v) {
                        setState(() => _backInStock = v);
                        _savePreference('notif_back_in_stock', v);
                      },
                    ),
                  ],
                ),
              ],
            ),
    );
  }

  Widget _buildSection({required String title, required List<Widget> children}) {
    return Container(
      decoration: BoxDecoration(
        color: NovaTheme.surfaceColor,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Text(
              title,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: NovaTheme.textSecondary,
              ),
            ),
          ),
          ...children,
        ],
      ),
    );
  }

  Widget _buildSwitchTile({
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return SwitchListTile(
      title: Text(
        title,
        style: const TextStyle(fontSize: 15, color: NovaTheme.textPrimary),
      ),
      subtitle: Text(
        subtitle,
        style: const TextStyle(fontSize: 13, color: NovaTheme.textSecondary),
      ),
      value: value,
      onChanged: onChanged,
      activeColor: NovaTheme.primaryColor,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16),
    );
  }
}

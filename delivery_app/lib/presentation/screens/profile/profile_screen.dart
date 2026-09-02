import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../../core/theme/app_theme.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: Consumer<AuthProvider>(
        builder: (context, auth, _) {
          final driver = auth.driver;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                CircleAvatar(
                  radius: 50,
                  backgroundColor: AppTheme.secondaryColor,
                  child: Text(
                    (driver?.fullName ?? 'D')[0].toUpperCase(),
                    style: const TextStyle(
                      fontSize: 40,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.primaryColor,
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  driver?.fullName ?? 'Driver',
                  style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Text(
                  driver?.phone ?? '',
                  style: TextStyle(color: AppTheme.textSecondary),
                ),
                const SizedBox(height: 32),
                _buildProfileCard([
                  _buildProfileItem(Icons.person, 'Full Name', driver?.fullName ?? ''),
                  const Divider(),
                  _buildProfileItem(Icons.phone, 'Phone', driver?.phone ?? ''),
                  const Divider(),
                  _buildProfileItem(Icons.email, 'Email', driver?.email ?? 'Not set'),
                ]),
                const SizedBox(height: 16),
                _buildProfileCard([
                  _buildProfileItem(Icons.local_shipping, 'Status', driver?.currentStatus ?? 'Offline'),
                  const Divider(),
                  _buildProfileItem(Icons.check_circle, 'Active', driver?.isActive == true ? 'Yes' : 'No'),
                ]),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    onPressed: () async {
                      final confirmed = await showDialog<bool>(
                        context: context,
                        builder: (context) => AlertDialog(
                          title: const Text('Logout'),
                          content: const Text('Are you sure you want to logout?'),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(context, false),
                              child: const Text('Cancel'),
                            ),
                            ElevatedButton(
                              onPressed: () => Navigator.pop(context, true),
                              style: ElevatedButton.styleFrom(backgroundColor: AppTheme.errorColor),
                              child: const Text('Logout'),
                            ),
                          ],
                        ),
                      );

                      if (confirmed == true && context.mounted) {
                        await auth.logout();
                      }
                    },
                    icon: const Icon(Icons.logout),
                    label: const Text('Logout'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppTheme.errorColor,
                      side: const BorderSide(color: AppTheme.errorColor),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildProfileCard(List<Widget> children) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(children: children),
      ),
    );
  }

  Widget _buildProfileItem(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(icon, color: AppTheme.secondaryColor, size: 24),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
                Text(value, style: const TextStyle(fontWeight: FontWeight.w500)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

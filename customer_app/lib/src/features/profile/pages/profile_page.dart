import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nova_core/nova_core.dart';
import '../bloc/profile_bloc.dart';
import '../bloc/profile_event.dart';
import '../bloc/profile_state.dart';
import '../../auth/bloc/auth_bloc.dart';
import '../../auth/bloc/auth_event.dart';
import '../../notifications/bloc/notification_bloc.dart';
import '../../notifications/bloc/notification_state.dart';
import '../../wishlist/bloc/wishlist_bloc.dart';
import '../../wishlist/bloc/wishlist_state.dart';
import '../../../core/di/injection.dart';
import '../../../core/router/app_router.dart';
import '../../../core/utils/responsive_layout.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<ProfileBloc>()..add(const LoadProfile()),
      child: const _ProfileView(),
    );
  }
}

class _ProfileView extends StatelessWidget {
  const _ProfileView();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: NovaTheme.backgroundColor,
      appBar: AppBar(title: const Text('Profile')),
      body: SafeArea(
        child: ResponsiveLayout.constrainWidth(
          context,
          child: SingleChildScrollView(
            child: Column(
              children: [
                _buildProfileHeader(context),
                const SizedBox(height: 8),
                _buildMenuSection(context),
                const SizedBox(height: 8),
                _buildBottomMenuSection(context),
                const SizedBox(height: 24),
                _buildVersionInfo(),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildProfileHeader(BuildContext context) {
    return BlocBuilder<ProfileBloc, ProfileState>(
      builder: (context, state) {
        String name = 'Guest User';
        String email = 'guest@example.com';
        String phone = '';
        String? avatarUrl;

        if (state is ProfileLoaded) {
          name = state.user.fullName;
          email = state.user.email ?? 'No email';
          phone = state.user.phone ?? '';
          avatarUrl = state.user.avatarUrl;
        }

        return Container(
          width: double.infinity,
          padding: const EdgeInsets.all(24),
          color: NovaTheme.surfaceColor,
          child: Column(
            children: [
              Stack(
                children: [
                  CircleAvatar(
                    radius: 50,
                    backgroundColor: NovaTheme.borderColor,
                    backgroundImage: avatarUrl != null ? NetworkImage(avatarUrl) : null,
                    child: avatarUrl == null ? const Icon(Icons.person, size: 50, color: NovaTheme.textHint) : null,
                  ),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: const BoxDecoration(color: NovaTheme.primaryColor, shape: BoxShape.circle),
                      child: const Icon(Icons.camera_alt, size: 16, color: NovaTheme.surfaceColor),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Text(name, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: NovaTheme.textPrimary)),
              const SizedBox(height: 4),
              if (email.isNotEmpty)
                Text(email, style: const TextStyle(fontSize: 14, color: NovaTheme.textSecondary)),
              if (phone.isNotEmpty) ...[
                const SizedBox(height: 2),
                Text(phone, style: const TextStyle(fontSize: 14, color: NovaTheme.textSecondary)),
              ],
              const SizedBox(height: 16),
              OutlinedButton.icon(
                onPressed: () => Navigator.pushNamed(context, AppRouter.editProfile),
                icon: const Icon(Icons.edit_outlined, size: 18),
                label: const Text('Edit Profile'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: NovaTheme.primaryColor,
                  side: const BorderSide(color: NovaTheme.primaryColor),
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildMenuSection(BuildContext context) {
    return Container(
      color: NovaTheme.surfaceColor,
      child: Column(
        children: [
          _buildMenuItem(
            context: context,
            icon: Icons.shopping_bag_outlined,
            title: 'My Orders',
            onTap: () => Navigator.pushNamed(context, AppRouter.orders),
          ),
          _buildDivider(),
          _buildMenuItem(
            context: context,
            icon: Icons.location_on_outlined,
            title: 'My Addresses',
            onTap: () {},
          ),
          _buildDivider(),
          BlocBuilder<WishlistBloc, WishlistState>(
            builder: (context, wishlistState) {
              final wishlistCount = wishlistState is WishlistLoaded ? wishlistState.items.length : 0;
              return _buildMenuItem(
                context: context,
                icon: Icons.favorite_outline,
                title: 'Wishlist',
                badge: wishlistCount > 0 ? '$wishlistCount' : null,
                onTap: () => Navigator.pushNamed(context, AppRouter.wishlist),
              );
            },
          ),
          _buildDivider(),
          _buildMenuItem(
            context: context,
            icon: Icons.payment_outlined,
            title: 'Payment Methods',
            onTap: () {},
          ),
          _buildDivider(),
          _buildMenuItem(
            context: context,
            icon: Icons.local_offer_outlined,
            title: 'Coupons',
            onTap: () {},
          ),
          _buildDivider(),
          BlocBuilder<NotificationBloc, NotificationState>(
            builder: (context, notifState) {
              final unreadCount = notifState is NotificationsLoaded ? notifState.unreadCount : 0;
              return _buildMenuItem(
                context: context,
                icon: Icons.notifications_outlined,
                title: 'Notifications',
                badge: unreadCount > 0 ? '$unreadCount' : null,
                onTap: () => Navigator.pushNamed(context, AppRouter.notifications),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildBottomMenuSection(BuildContext context) {
    return Container(
      color: NovaTheme.surfaceColor,
      child: Column(
        children: [
          _buildMenuItem(context: context, icon: Icons.help_outline, title: 'Help Center', onTap: () {}),
          _buildDivider(),
          _buildMenuItem(context: context, icon: Icons.info_outline, title: 'About', onTap: () {}),
          _buildDivider(),
          _buildMenuItem(
            context: context,
            icon: Icons.logout,
            title: 'Logout',
            isDestructive: true,
            onTap: () => _showLogoutDialog(context),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuItem({
    required BuildContext context,
    required IconData icon,
    required String title,
    String? badge,
    bool isDestructive = false,
    required VoidCallback onTap,
  }) {
    final color = isDestructive ? NovaTheme.errorColor : NovaTheme.textPrimary;

    return Material(
      color: Colors.transparent,
      child: ListTile(
        leading: Icon(icon, color: color),
        title: Text(title, style: TextStyle(fontSize: 16, color: color)),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (badge != null)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(color: NovaTheme.secondaryColor, borderRadius: BorderRadius.circular(10)),
                child: Text(badge, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: NovaTheme.surfaceColor)),
              ),
            if (!isDestructive) ...[
              const SizedBox(width: 8),
              const Icon(Icons.chevron_right, color: NovaTheme.textHint),
            ],
          ],
        ),
        onTap: onTap,
      ),
    );
  }

  Widget _buildDivider() {
    return const Divider(height: 1, thickness: 1, color: NovaTheme.dividerColor, indent: 16, endIndent: 0);
  }

  Widget _buildVersionInfo() {
    return Center(
      child: Text('Version 1.0.0 (Build 1)', style: TextStyle(fontSize: 12, color: NovaTheme.textHint)),
    );
  }

  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Logout'),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(dialogContext), child: Text('Cancel', style: TextStyle(color: NovaTheme.textSecondary))),
          TextButton(
            onPressed: () {
              Navigator.pop(dialogContext);
              context.read<AuthBloc>().add(const AuthLogout());
            },
            child: const Text('Logout', style: TextStyle(color: NovaTheme.errorColor)),
          ),
        ],
      ),
    );
  }
}

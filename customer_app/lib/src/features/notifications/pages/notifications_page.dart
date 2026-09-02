import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nova_core/nova_core.dart';
import 'package:shimmer/shimmer.dart';
import '../bloc/notification_bloc.dart';
import '../bloc/notification_event.dart';
import '../bloc/notification_state.dart';
import '../../../core/di/injection.dart';
import '../../../core/utils/responsive_layout.dart';

class NotificationsPage extends StatelessWidget {
  const NotificationsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<NotificationBloc>()..add(const LoadNotifications()),
      child: const _NotificationsView(),
    );
  }
}

class _NotificationsView extends StatelessWidget {
  const _NotificationsView();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: NovaTheme.backgroundColor,
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          BlocBuilder<NotificationBloc, NotificationState>(
            builder: (context, state) {
              if (state is NotificationsLoaded && state.unreadCount > 0) {
                return TextButton(
                  onPressed: () => context.read<NotificationBloc>().add(const MarkAllAsRead()),
                  child: const Text('Mark all read', style: TextStyle(color: NovaTheme.secondaryColor)),
                );
              }
              return const SizedBox.shrink();
            },
          ),
        ],
      ),
      body: SafeArea(
        child: ResponsiveLayout.constrainWidth(
          context,
          child: BlocBuilder<NotificationBloc, NotificationState>(
            builder: (context, state) {
              if (state is NotificationLoading) return _buildLoadingShimmer();
              if (state is NotificationError) return Center(child: Text(state.message));
              if (state is NotificationsLoaded) {
                if (state.notifications.isEmpty) return _buildEmptyState();
                return _buildNotificationsList(context, state);
              }
              return const SizedBox.shrink();
            },
          ),
        ),
      ),
    );
  }

  Widget _buildLoadingShimmer() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: 5,
      itemBuilder: (context, index) {
        return Shimmer.fromColors(
          baseColor: NovaTheme.grey200,
          highlightColor: NovaTheme.grey100,
          child: Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: NovaTheme.surfaceColor,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(width: 48, height: 48, decoration: const BoxDecoration(color: NovaTheme.grey200, shape: BoxShape.circle)),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(width: 150, height: 16, decoration: BoxDecoration(color: NovaTheme.grey200, borderRadius: BorderRadius.circular(4))),
                      const SizedBox(height: 8),
                      Container(width: double.infinity, height: 14, decoration: BoxDecoration(color: NovaTheme.grey200, borderRadius: BorderRadius.circular(4))),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.notifications_none_rounded, size: 80, color: NovaTheme.textHint),
          const SizedBox(height: 16),
          const Text('No notifications yet', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: NovaTheme.textPrimary)),
          const SizedBox(height: 8),
          const Text('You\'ll see updates about your orders here', style: TextStyle(fontSize: 14, color: NovaTheme.textSecondary)),
        ],
      ),
    );
  }

  Widget _buildNotificationsList(BuildContext context, NotificationsLoaded state) {
    return RefreshIndicator(
      color: NovaTheme.primaryColor,
      onRefresh: () async => context.read<NotificationBloc>().add(const LoadNotifications()),
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: state.notifications.length,
        itemBuilder: (context, index) => _buildNotificationCard(context, state.notifications[index]),
      ),
    );
  }

  Widget _buildNotificationCard(BuildContext context, dynamic notification) {
    final title = notification['title'] ?? '';
    final body = notification['body'] ?? notification['message'] ?? '';
    final type = notification['type'] ?? 'info';
    final isRead = notification['is_read'] ?? notification['isRead'] ?? false;
    final createdAt = notification['created_at'] ?? notification['createdAt'];
    final id = notification['id'] ?? '';

    final iconData = _getIconForType(type);
    final iconColor = _getColorForType(type);

    return Dismissible(
      key: Key(id.toString()),
      direction: DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: NovaTheme.errorColor,
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Icon(Icons.delete_outline, color: NovaTheme.textOnPrimary),
      ),
      onDismissed: (_) {
        context.read<NotificationBloc>().add(MarkAsRead(notificationId: id));
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isRead ? NovaTheme.surfaceColor : NovaTheme.primaryColor.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(12),
          border: isRead ? null : Border.all(color: NovaTheme.primaryColor.withValues(alpha: 0.2)),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: iconColor.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(iconData, color: iconColor, size: 24),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          title,
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: isRead ? FontWeight.w500 : FontWeight.bold,
                            color: NovaTheme.textPrimary,
                          ),
                        ),
                      ),
                      if (!isRead)
                        Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(color: NovaTheme.primaryColor, shape: BoxShape.circle),
                        ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(body, style: const TextStyle(fontSize: 13, color: NovaTheme.textSecondary), maxLines: 2, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 8),
                  Text(_formatTime(createdAt), style: TextStyle(fontSize: 12, color: NovaTheme.textHint)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  IconData _getIconForType(String type) {
    switch (type) {
      case 'order':
        return Icons.shopping_bag_outlined;
      case 'promo':
        return Icons.local_offer_outlined;
      case 'payment':
        return Icons.payment_outlined;
      default:
        return Icons.notifications_outlined;
    }
  }

  Color _getColorForType(String type) {
    switch (type) {
      case 'order':
        return NovaTheme.primaryColor;
      case 'promo':
        return NovaTheme.secondaryColor;
      case 'payment':
        return NovaTheme.successColor;
      default:
        return NovaTheme.grey500;
    }
  }

  String _formatTime(dynamic timestamp) {
    if (timestamp == null) return '';
    try {
      final date = DateTime.parse(timestamp.toString());
      final now = DateTime.now();
      final diff = now.difference(date);

      if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
      if (diff.inHours < 24) return '${diff.inHours}h ago';
      if (diff.inDays < 7) return '${diff.inDays}d ago';
      return '${date.day}/${date.month}/${date.year}';
    } catch (e) {
      return '';
    }
  }
}

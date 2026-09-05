import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:nova_core/nova_core.dart';

class PushNotificationService {
  final NovaApiClient _apiClient;
  final GlobalKey<NavigatorState>? navigatorKey;

  PushNotificationService(this._apiClient, {this.navigatorKey});

  Future<void> initialize() async {
    try {
      final messaging = FirebaseMessaging.instance;
      final settings = await messaging.requestPermission(
        alert: true,
        badge: true,
        sound: true,
      );

      if (settings.authorizationStatus == AuthorizationStatus.authorized) {
        final token = await messaging.getToken();
        if (token != null) {
          await _registerToken(token);
        }
        messaging.onTokenRefresh.listen(_registerToken);
      }

      FirebaseMessaging.onMessage.listen(_handleForegroundMessage);
      FirebaseMessaging.onMessageOpenedApp.listen(_handleNotificationTap);
    } catch (e) {
      debugPrint('PushNotificationService init error: $e');
    }
  }

  Future<void> _registerToken(String token) async {
    try {
      await _apiClient.dio.post(
        '/api/v1/auth/fcm-token',
        data: {'fcm_token': token},
      );
    } catch (e) {
      debugPrint('FCM token registration error: $e');
    }
  }

  void _handleForegroundMessage(RemoteMessage message) {
    debugPrint('Foreground message: ${message.notification?.title}');
    final notification = message.notification;
    if (notification != null) {
      _showLocalNotification(
        title: notification.title ?? '',
        body: notification.body ?? '',
        data: message.data,
      );
    }
  }

  void _handleNotificationTap(RemoteMessage message) {
    debugPrint('Notification tapped: ${message.data}');
    _navigateFromPayload(message.data);
  }

  void _showLocalNotification({
    required String title,
    required String body,
    required Map<String, dynamic> data,
  }) {
    final context = navigatorKey?.currentContext;
    if (context == null) return;

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            if (body.isNotEmpty) Text(body),
          ],
        ),
        action: SnackBarAction(
          label: 'View',
          textColor: NovaTheme.secondaryColor,
          onPressed: () => _navigateFromPayload(data),
        ),
        duration: const Duration(seconds: 4),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );
  }

  void _navigateFromPayload(Map<String, dynamic> data) {
    final navigator = navigatorKey?.currentState;
    if (navigator == null) return;

    final type = data['type'] ?? '';
    final id = data['id'] ?? '';

    switch (type) {
      case 'order_status':
      case 'order_confirmed':
      case 'order_shipped':
      case 'order_delivered':
        if (id.isNotEmpty) {
          navigator.pushNamed('/orders', arguments: id);
        } else {
          navigator.pushNamed('/orders');
        }
        break;
      case 'promo':
      case 'promo_new':
      case 'promo_sale':
        navigator.pushNamed('/');
        break;
      default:
        navigator.pushNamed('/notifications');
        break;
    }
  }
}

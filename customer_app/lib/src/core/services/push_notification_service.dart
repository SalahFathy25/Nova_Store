import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:nova_core/nova_core.dart';

class PushNotificationService {
  final FirebaseMessaging _messaging;
  final NovaApiClient _apiClient;

  PushNotificationService(this._messaging, this._apiClient);

  Future<void> initialize() async {
    final settings = await _messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    if (settings.authorizationStatus == AuthorizationStatus.authorized) {
      final token = await _messaging.getToken();
      if (token != null) {
        await _registerToken(token);
      }

      _messaging.onTokenRefresh.listen(_registerToken);
    }

    FirebaseMessaging.onMessage.listen(_handleForegroundMessage);
    FirebaseMessaging.onMessageOpenedApp.listen(_handleNotificationTap);
  }

  Future<void> _registerToken(String token) async {
    try {
      await _apiClient.dio.post(
        '/api/v1/auth/fcm-token',
        data: {'fcm_token': token},
      );
    } catch (_) {}
  }

  void _handleForegroundMessage(RemoteMessage message) {}

  void _handleNotificationTap(RemoteMessage message) {}
}

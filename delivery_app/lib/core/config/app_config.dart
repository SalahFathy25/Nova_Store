class AppConfig {
  static const String appName = 'NOVA Delivery';

  // For production: https://nova-store-production-03ac.up.railway.app
  // For development: http://192.168.1.5:3000
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://nova-store-production-03ac.up.railway.app',
  );

  // WebSocket URL
  static const String wsUrl = String.fromEnvironment(
    'WS_URL',
    defaultValue: 'https://nova-store-production-03ac.up.railway.app/delivery',
  );

  static const String defaultTenantId = 'a0000000-0000-0000-0000-000000000001';
}

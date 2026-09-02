class AppConstants {
  AppConstants._();

  // Storage keys
  static const String accessTokenKey = 'access_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String tenantIdKey = 'tenant_id';
  static const String userDataKey = 'user_data';
  static const String themeKey = 'theme_mode';
  static const String localeKey = 'locale';

  // Pagination
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;

  // Animation durations
  static const Duration shortAnimation = Duration(milliseconds: 200);
  static const Duration mediumAnimation = Duration(milliseconds: 350);
  static const Duration longAnimation = Duration(milliseconds: 500);

  // Debounce
  static const Duration searchDebounce = Duration(milliseconds: 500);

  // Google Maps
  static const String googleMapsApiKey = 'AlzaSyD9W-FwHKKQsp-KKEYXSvqKutCTsauk-3U';
}

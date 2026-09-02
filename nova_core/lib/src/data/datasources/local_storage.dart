import 'package:shared_preferences/shared_preferences.dart';

class LocalStorage {
  final SharedPreferences _prefs;

  LocalStorage(this._prefs);

  // Auth tokens
  Future<void> saveAccessToken(String token) async {
    await _prefs.setString('access_token', token);
  }

  String? getAccessToken() {
    return _prefs.getString('access_token');
  }

  Future<void> saveRefreshToken(String token) async {
    await _prefs.setString('refresh_token', token);
  }

  String? getRefreshToken() {
    return _prefs.getString('refresh_token');
  }

  Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    await Future.wait([
      _prefs.setString('access_token', accessToken),
      _prefs.setString('refresh_token', refreshToken),
    ]);
  }

  Future<void> clearTokens() async {
    await Future.wait([
      _prefs.remove('access_token'),
      _prefs.remove('refresh_token'),
    ]);
  }

  // Tenant ID
  Future<void> saveTenantId(String tenantId) async {
    await _prefs.setString('tenant_id', tenantId);
  }

  String? getTenantId() {
    return _prefs.getString('tenant_id');
  }

  Future<void> clearTenantId() async {
    await _prefs.remove('tenant_id');
  }

  // User data
  Future<void> saveUserData(Map<String, dynamic> userData) async {
    await _prefs.setString('user_data', userData.toString());
  }

  String? getUserData() {
    return _prefs.getString('user_data');
  }

  Future<void> clearUserData() async {
    await _prefs.remove('user_data');
  }

  // Theme
  Future<void> saveThemeMode(String themeMode) async {
    await _prefs.setString('theme_mode', themeMode);
  }

  String? getThemeMode() {
    return _prefs.getString('theme_mode');
  }

  // Clear all
  Future<void> clearAll() async {
    await _prefs.clear();
  }

  // Check if user is logged in
  bool get isLoggedIn {
    return _prefs.getString('access_token') != null;
  }
}

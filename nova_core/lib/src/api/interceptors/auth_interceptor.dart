import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthInterceptor extends Interceptor {
  final SharedPreferences _prefs;
  final Function() onUnauthorized;

  AuthInterceptor(this._prefs, {required this.onUnauthorized});

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final token = _prefs.getString('access_token');
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }

    final tenantId = _prefs.getString('tenant_id');
    if (tenantId != null) {
      options.headers['X-Tenant-ID'] = tenantId;
    }

    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (err.response?.statusCode == 401) {
      onUnauthorized();
    }
    handler.next(err);
  }
}

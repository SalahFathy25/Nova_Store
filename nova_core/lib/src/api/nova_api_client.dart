import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/constants/api_constants.dart';

class NovaApiClient {
  late final Dio _dio;
  final SharedPreferences _prefs;

  NovaApiClient(this._prefs) {
    _dio = Dio(
      BaseOptions(
        baseUrl: ApiConstants.baseUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        headers: {
          ApiConstants.contentTypeHeader: 'application/json',
        },
      ),
    );

    _dio.interceptors.addAll([
      _AuthInterceptor(_prefs),
      if (kDebugMode) _LoggingInterceptor(),
    ]);
  }

  Dio get dio => _dio;

  void setTenantId(String tenantId) {
    _dio.options.headers[ApiConstants.tenantIdHeader] = tenantId;
  }

  void setAuthorization(String token) {
    _dio.options.headers[ApiConstants.authorizationHeader] = 'Bearer $token';
  }

  void clearAuthorization() {
    _dio.options.headers.remove(ApiConstants.authorizationHeader);
  }
}

class _AuthInterceptor extends Interceptor {
  final SharedPreferences _prefs;
  bool _isRefreshing = false;

  _AuthInterceptor(this._prefs);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final token = _prefs.getString(ApiConstants.accessTokenKey);
    if (token != null) {
      options.headers[ApiConstants.authorizationHeader] = 'Bearer $token';
    }

    final tenantId = _prefs.getString(ApiConstants.tenantIdKey) ?? ApiConstants.defaultTenantId;
    options.headers[ApiConstants.tenantIdHeader] = tenantId;

    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401 && !_isRefreshing) {
      final refreshToken = _prefs.getString(ApiConstants.refreshTokenKey);
      if (refreshToken == null) {
        await _clearTokens();
        handler.next(err);
        return;
      }

      _isRefreshing = true;
      try {
        final refreshDio = Dio(BaseOptions(
          baseUrl: ApiConstants.baseUrl,
          connectTimeout: const Duration(seconds: 15),
          receiveTimeout: const Duration(seconds: 15),
        ));

        final response = await refreshDio.post(
          ApiConstants.refreshToken,
          data: {'refresh_token': refreshToken},
        );

        if (response.statusCode == 200) {
          final data = response.data;
          final newAccessToken = data['access_token'] as String;
          final newRefreshToken = data['refresh_token'] as String;

          await _prefs.setString(ApiConstants.accessTokenKey, newAccessToken);
          await _prefs.setString(ApiConstants.refreshTokenKey, newRefreshToken);

          err.requestOptions.headers[ApiConstants.authorizationHeader] = 'Bearer $newAccessToken';
          final retryResponse = await refreshDio.fetch(err.requestOptions);
          handler.resolve(retryResponse);
          return;
        }
      } catch (_) {
        await _clearTokens();
      } finally {
        _isRefreshing = false;
      }
    }

    handler.next(err);
  }

  Future<void> _clearTokens() async {
    await _prefs.remove(ApiConstants.accessTokenKey);
    await _prefs.remove(ApiConstants.refreshTokenKey);
    await _prefs.remove(ApiConstants.userIdKey);
  }
}

class _LoggingInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    debugPrint('[API] REQUEST[${options.method}] => ${options.path}');
    handler.next(options);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    debugPrint('[API] RESPONSE[${response.statusCode}] => ${response.requestOptions.path}');
    handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    debugPrint('[API] ERROR[${err.response?.statusCode}] => ${err.requestOptions.path}');
    handler.next(err);
  }
}

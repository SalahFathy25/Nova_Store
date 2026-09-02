import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:nova_core/src/core/constants/api_constants.dart';
import 'package:nova_core/src/domain/entities/app_config.dart';

class AppConfigRepository {
  final Dio _dio;

  AppConfigRepository(this._dio);

  AppConfig? _cachedConfig;

  Future<AppConfig> getConfig({bool forceRefresh = false}) async {
    if (!forceRefresh && _cachedConfig != null) {
      return _cachedConfig!;
    }

    try {
      final response = await _dio.get(ApiConstants.appConfig);
      final config = AppConfig.fromJson(response.data);
      _cachedConfig = config;
      return config;
    } catch (e) {
      debugPrint('[AppConfig] Error fetching config: $e');
      return AppConfig.empty;
    }
  }

  void clearCache() {
    _cachedConfig = null;
  }
}

import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:nova_core/nova_core.dart';

class AuthProvider extends ChangeNotifier {
  final DeliveryRemoteDataSource _remoteDataSource;
  final FlutterSecureStorage _storage;
  final Dio _dio;

  Driver? _driver;
  bool _isLoading = true;
  String? _error;

  AuthProvider({
    required DeliveryRemoteDataSource remoteDataSource,
    required FlutterSecureStorage storage,
    required Dio dio,
  })  : _remoteDataSource = remoteDataSource,
        _storage = storage,
        _dio = dio;

  Driver? get driver => _driver;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _driver != null;
  String? get error => _error;

  Future<void> init() async {
    _isLoading = true;
    notifyListeners();

    final token = await _storage.read(key: ApiConstants.accessTokenKey);
    if (token != null) {
      try {
        final response = await _remoteDataSource.getMyProfile();
        _driver = Driver.fromJson(response.data!);
      } catch (e) {
        await _storage.delete(key: ApiConstants.accessTokenKey);
        await _storage.delete(key: ApiConstants.refreshTokenKey);
      }
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<bool> login(String phone, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _dio.post('/api/v1/auth/login', data: {
        'phone': phone,
        'password': password,
        'tenant_id': 'a0000000-0000-0000-0000-000000000001',
      });

      final data = response.data;
      if (data['access_token'] != null) {
        await _storage.write(key: ApiConstants.accessTokenKey, value: data['access_token']);
        await _storage.write(key: ApiConstants.refreshTokenKey, value: data['refresh_token']);
        _dio.options.headers['Authorization'] = 'Bearer ${data['access_token']}';

        final profileResponse = await _remoteDataSource.getMyProfile();
        _driver = Driver.fromJson(profileResponse.data!);
        _isLoading = false;
        notifyListeners();
        return true;
      }

      _error = 'Login failed';
      _isLoading = false;
      notifyListeners();
      return false;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    await _storage.delete(key: ApiConstants.accessTokenKey);
    await _storage.delete(key: ApiConstants.refreshTokenKey);
    _dio.options.headers.remove('Authorization');
    _driver = null;
    notifyListeners();
  }

  Future<void> updateProfile(Map<String, dynamic> data) async {
    final response = await _remoteDataSource.updateProfile(data);
    _driver = Driver.fromJson(response.data!);
    notifyListeners();
  }
}

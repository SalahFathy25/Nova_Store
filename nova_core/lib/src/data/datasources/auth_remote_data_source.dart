import 'package:dio/dio.dart';
import '../../core/constants/api_constants.dart';
import '../../api/models/api_response.dart';

class AuthRemoteDataSource {
  final Dio _dio;

  AuthRemoteDataSource(this._dio);

  Future<ApiResponse<Map<String, dynamic>>> login({
    required String email,
    required String password,
    required String tenantId,
  }) async {
    final response = await _dio.post(
      ApiConstants.login,
      data: {
        'email': email,
        'password': password,
      },
      options: Options(
        headers: {'X-Tenant-ID': tenantId},
      ),
    );
    return ApiResponse.fromJson(response.data, (data) => data);
  }

  Future<ApiResponse<Map<String, dynamic>>> register({
    required String fullName,
    required String email,
    required String password,
    required String tenantId,
    String? phone,
  }) async {
    final response = await _dio.post(
      ApiConstants.register,
      data: {
        'full_name': fullName,
        'email': email,
        'password': password,
        if (phone != null) 'phone': phone,
      },
      options: Options(
        headers: {'X-Tenant-ID': tenantId},
      ),
    );
    return ApiResponse.fromJson(response.data, (data) => data);
  }

  Future<ApiResponse<Map<String, dynamic>>> sendOtp({
    required String phone,
    required String tenantId,
    String purpose = 'login',
  }) async {
    final response = await _dio.post(
      ApiConstants.sendOtp,
      data: {
        'phone': phone,
        'purpose': purpose,
      },
      options: Options(
        headers: {'X-Tenant-ID': tenantId},
      ),
    );
    return ApiResponse.fromJson(response.data, (data) => data);
  }

  Future<ApiResponse<Map<String, dynamic>>> verifyOtp({
    required String phone,
    required String code,
    required String tenantId,
    String purpose = 'login',
  }) async {
    final response = await _dio.post(
      ApiConstants.verifyOtp,
      data: {
        'phone': phone,
        'code': code,
        'purpose': purpose,
      },
      options: Options(
        headers: {'X-Tenant-ID': tenantId},
      ),
    );
    return ApiResponse.fromJson(response.data, (data) => data);
  }

  Future<ApiResponse<Map<String, dynamic>>> refreshToken({
    required String refreshToken,
  }) async {
    final response = await _dio.post(
      ApiConstants.refreshToken,
      data: {
        'refresh_token': refreshToken,
      },
    );
    return ApiResponse.fromJson(response.data, (data) => data);
  }

  Future<ApiResponse<Map<String, dynamic>>> getProfile() async {
    final response = await _dio.get(ApiConstants.profile);
    return ApiResponse.fromJson(response.data, (data) => data);
  }
}

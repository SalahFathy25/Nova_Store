import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import '../../domain/entities/user.dart';
import '../../domain/entities/auth.dart';
import '../../domain/failures/failures.dart';
import '../../core/constants/api_constants.dart';
import '../datasources/local_storage.dart';
import 'auth_repository.dart';

class AuthRepositoryImpl implements AuthRepository {
  final Dio _dio;
  final LocalStorage _localStorage;

  AuthRepositoryImpl(this._dio, this._localStorage);

  @override
  Future<Either<Failure, AuthResponse>> login({
    required String email,
    required String password,
    required String tenantId,
  }) async {
    try {
      final response = await _dio.post(ApiConstants.login, data: {
        'email': email,
        'password': password,
      });
      final data = response.data['data'] ?? response.data;
      final authResponse = AuthResponse.fromJson(data);

      await _localStorage.saveTokens(
        accessToken: authResponse.tokens.accessToken,
        refreshToken: authResponse.tokens.refreshToken,
      );
      await _localStorage.saveTenantId(tenantId);

      return Right(authResponse);
    } on DioException catch (e) {
      return Left(_handleDioError(e));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, AuthResponse>> register({
    required String fullName,
    required String email,
    required String password,
    required String tenantId,
    String? phone,
  }) async {
    try {
      final response = await _dio.post(ApiConstants.register, data: {
        'full_name': fullName,
        'email': email,
        'password': password,
        if (phone != null) 'phone': phone,
      });
      final data = response.data['data'] ?? response.data;
      final authResponse = AuthResponse.fromJson(data);

      await _localStorage.saveTokens(
        accessToken: authResponse.tokens.accessToken,
        refreshToken: authResponse.tokens.refreshToken,
      );
      await _localStorage.saveTenantId(tenantId);

      return Right(authResponse);
    } on DioException catch (e) {
      return Left(_handleDioError(e));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, String>> sendOtp({
    required String phone,
    required String tenantId,
    String purpose = 'login',
  }) async {
    try {
      final response = await _dio.post(ApiConstants.sendOtp, data: {
        'phone': phone,
        'purpose': purpose,
      });
      return Right(response.data['message'] ?? 'OTP sent successfully');
    } on DioException catch (e) {
      return Left(_handleDioError(e));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, AuthResponse>> verifyOtp({
    required String phone,
    required String code,
    required String tenantId,
    String purpose = 'login',
  }) async {
    try {
      final response = await _dio.post(ApiConstants.verifyOtp, data: {
        'phone': phone,
        'code': code,
        'purpose': purpose,
      });
      final data = response.data['data'] ?? response.data;
      final authResponse = AuthResponse.fromJson(data);

      await _localStorage.saveTokens(
        accessToken: authResponse.tokens.accessToken,
        refreshToken: authResponse.tokens.refreshToken,
      );
      await _localStorage.saveTenantId(tenantId);

      return Right(authResponse);
    } on DioException catch (e) {
      return Left(_handleDioError(e));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, User>> getProfile() async {
    try {
      final response = await _dio.get(ApiConstants.profile);
      final user = User.fromJson(response.data['data'] ?? response.data);
      return Right(user);
    } on DioException catch (e) {
      return Left(_handleDioError(e));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, User>> updateProfile({
    String? fullName,
    String? email,
    String? phone,
  }) async {
    try {
      final data = <String, dynamic>{};
      if (fullName != null) data['full_name'] = fullName;
      if (email != null) data['email'] = email;
      if (phone != null) data['phone'] = phone;

      final response = await _dio.patch(ApiConstants.profile, data: data);
      final user = User.fromJson(response.data['data'] ?? response.data);
      return Right(user);
    } on DioException catch (e) {
      return Left(_handleDioError(e));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, String>> forgotPassword({required String email}) async {
    try {
      final response = await _dio.post(ApiConstants.forgotPassword, data: {
        'email': email,
      });
      return Right(response.data['message'] ?? 'Password reset email sent');
    } on DioException catch (e) {
      return Left(_handleDioError(e));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, String>> resetPassword({
    required String email,
    required String code,
    required String newPassword,
  }) async {
    try {
      final response = await _dio.post(ApiConstants.resetPassword, data: {
        'email': email,
        'code': code,
        'new_password': newPassword,
      });
      return Right(response.data['message'] ?? 'Password reset successfully');
    } on DioException catch (e) {
      return Left(_handleDioError(e));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> logout() async {
    try {
      await _localStorage.clearTokens();
      await _localStorage.clearTenantId();
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(message: e.toString()));
    }
  }

  Failure _handleDioError(DioException e) {
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return const NetworkFailure(message: 'Connection timed out');
      case DioExceptionType.connectionError:
        return const NetworkFailure(message: 'No internet connection');
      case DioExceptionType.badResponse:
        final statusCode = e.response?.statusCode;
        final message = e.response?.data?['message'] ?? 'Server error';
        if (statusCode == 401) {
          return AuthFailure(message: message, statusCode: statusCode);
        }
        return ServerFailure(message: message, statusCode: statusCode);
      default:
        return ServerFailure(message: e.message ?? 'Unknown error');
    }
  }
}

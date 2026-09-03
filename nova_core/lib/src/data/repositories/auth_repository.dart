import 'package:dartz/dartz.dart';
import '../../domain/entities/user.dart';
import '../../domain/entities/auth.dart';
import '../../domain/failures/failures.dart';

abstract class AuthRepository {
  Future<Either<Failure, AuthResponse>> login({
    required String email,
    required String password,
    required String tenantId,
  });

  Future<Either<Failure, AuthResponse>> register({
    required String fullName,
    required String email,
    required String password,
    required String tenantId,
    String? phone,
  });

  Future<Either<Failure, String>> sendOtp({
    required String phone,
    required String tenantId,
    String purpose = 'login',
  });

  Future<Either<Failure, AuthResponse>> verifyOtp({
    required String phone,
    required String code,
    required String tenantId,
    String purpose = 'login',
  });

  Future<Either<Failure, User>> getProfile();

  Future<Either<Failure, User>> updateProfile({
    String? fullName,
    String? email,
    String? phone,
  });

  Future<Either<Failure, String>> forgotPassword({required String email});

  Future<Either<Failure, String>> resetPassword({
    required String email,
    required String code,
    required String newPassword,
  });

  Future<Either<Failure, void>> logout();
}

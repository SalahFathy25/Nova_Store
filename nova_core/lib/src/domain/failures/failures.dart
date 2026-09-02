import 'package:equatable/equatable.dart';

abstract class Failure extends Equatable {
  final String message;
  final int? statusCode;

  const Failure({
    required this.message,
    this.statusCode,
  });

  @override
  List<Object?> get props => [message, statusCode];
}

class ServerFailure extends Failure {
  const ServerFailure({
    super.message = 'Server error occurred',
    super.statusCode,
  });

  factory ServerFailure.fromMessage(String message) {
    return ServerFailure(message: message);
  }
}

class CacheFailure extends Failure {
  const CacheFailure({
    super.message = 'Cache error occurred',
  });
}

class NetworkFailure extends Failure {
  const NetworkFailure({
    super.message = 'No internet connection',
  });
}

class AuthFailure extends Failure {
  const AuthFailure({
    super.message = 'Authentication failed',
    super.statusCode,
  });

  factory AuthFailure.unauthorized() {
    return const AuthFailure(
      message: 'Unauthorized. Please login again.',
      statusCode: 401,
    );
  }

  factory AuthFailure.invalidCredentials() {
    return const AuthFailure(
      message: 'Invalid email or password',
      statusCode: 401,
    );
  }
}

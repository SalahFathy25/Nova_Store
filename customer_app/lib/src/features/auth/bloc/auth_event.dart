import 'package:equatable/equatable.dart';

abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

class AuthLogin extends AuthEvent {
  final String email;
  final String password;

  const AuthLogin({required this.email, required this.password});

  @override
  List<Object?> get props => [email, password];
}

class AuthRegister extends AuthEvent {
  final String fullName;
  final String email;
  final String password;

  const AuthRegister({
    required this.fullName,
    required this.email,
    required this.password,
  });

  @override
  List<Object?> get props => [fullName, email, password];
}

class AuthSendOtp extends AuthEvent {
  final String phone;

  const AuthSendOtp({required this.phone});

  @override
  List<Object?> get props => [phone];
}

class AuthVerifyOtp extends AuthEvent {
  final String phone;
  final String code;

  const AuthVerifyOtp({required this.phone, required this.code});

  @override
  List<Object?> get props => [phone, code];
}

class AuthCheckStatus extends AuthEvent {
  const AuthCheckStatus();
}

class AuthLogout extends AuthEvent {
  const AuthLogout();
}

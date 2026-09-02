import 'package:equatable/equatable.dart';
import 'package:nova_core/nova_core.dart';

abstract class AuthState extends Equatable {
  const AuthState();

  @override
  List<Object?> get props => [];
}

class AuthInitial extends AuthState {}

class AuthLoading extends AuthState {}

class AuthAuthenticated extends AuthState {
  final User user;

  const AuthAuthenticated({required this.user});

  @override
  List<Object?> get props => [user.id, user.fullName];
}

class AuthUnauthenticated extends AuthState {}

class AuthOtpSent extends AuthState {
  final String phone;

  const AuthOtpSent({required this.phone});

  @override
  List<Object?> get props => [phone];
}

class AuthError extends AuthState {
  final String message;

  const AuthError({required this.message});

  @override
  List<Object?> get props => [message];
}

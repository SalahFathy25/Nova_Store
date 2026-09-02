import 'package:equatable/equatable.dart';
import 'user.dart';

class AuthTokens extends Equatable {
  final String accessToken;
  final String refreshToken;
  final int expiresIn;

  const AuthTokens({
    required this.accessToken,
    required this.refreshToken,
    required this.expiresIn,
  });

  factory AuthTokens.fromJson(Map<String, dynamic> json) {
    return AuthTokens(
      accessToken: json['access_token'] ?? '',
      refreshToken: json['refresh_token'] ?? '',
      expiresIn: json['expires_in'] ?? 900,
    );
  }

  @override
  List<Object?> get props => [accessToken, refreshToken, expiresIn];
}

class AuthResponse extends Equatable {
  final User user;
  final AuthTokens tokens;

  const AuthResponse({
    required this.user,
    required this.tokens,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      user: User.fromJson(json['user']),
      tokens: AuthTokens.fromJson(json['tokens']),
    );
  }

  @override
  List<Object?> get props => [user, tokens];
}

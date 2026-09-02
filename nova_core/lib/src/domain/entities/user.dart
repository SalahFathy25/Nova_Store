import 'package:equatable/equatable.dart';

class User extends Equatable {
  final String id;
  final String tenantId;
  final String fullName;
  final String? email;
  final String? phone;
  final String role;
  final String? avatarUrl;
  final bool isActive;
  final bool isVerified;
  final DateTime? createdAt;

  const User({
    required this.id,
    required this.tenantId,
    required this.fullName,
    this.email,
    this.phone,
    required this.role,
    this.avatarUrl,
    this.isActive = true,
    this.isVerified = false,
    this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      tenantId: json['tenant_id'] ?? '',
      fullName: json['full_name'] ?? '',
      email: json['email'],
      phone: json['phone'],
      role: json['role'] ?? 'customer',
      avatarUrl: json['avatar_url'],
      isActive: json['is_active'] ?? true,
      isVerified: json['is_verified'] ?? false,
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'tenant_id': tenantId,
      'full_name': fullName,
      'email': email,
      'phone': phone,
      'role': role,
      'avatar_url': avatarUrl,
      'is_active': isActive,
      'is_verified': isVerified,
      'created_at': createdAt?.toIso8601String(),
    };
  }

  @override
  List<Object?> get props => [
        id,
        tenantId,
        fullName,
        email,
        phone,
        role,
        avatarUrl,
        isActive,
        isVerified,
      ];
}

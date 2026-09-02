import 'package:equatable/equatable.dart';

class CouponValidation extends Equatable {
  final bool valid;
  final String? code;
  final String? type;
  final double? discountAmount;
  final String? message;

  const CouponValidation({
    required this.valid,
    this.code,
    this.type,
    this.discountAmount,
    this.message,
  });

  factory CouponValidation.fromJson(Map<String, dynamic> json) {
    return CouponValidation(
      valid: json['valid'] ?? false,
      code: json['code'],
      type: json['type'],
      discountAmount: json['discount_amount']?.toDouble(),
      message: json['message'],
    );
  }

  @override
  List<Object?> get props => [valid, code, discountAmount];
}

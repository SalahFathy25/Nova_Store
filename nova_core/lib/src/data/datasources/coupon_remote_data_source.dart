import 'package:dio/dio.dart';
import '../../core/constants/api_constants.dart';
import '../../api/models/api_response.dart';

class CouponRemoteDataSource {
  final Dio _dio;
  CouponRemoteDataSource(this._dio);

  Future<ApiResponse<Map<String, dynamic>>> validateCoupon({
    required String code,
    required double subtotal,
  }) async {
    final response = await _dio.post(
      '${ApiConstants.coupons}/validate',
      data: {
        'code': code,
        'subtotal': subtotal,
      },
    );
    final data = response.data;
    return ApiResponse(
      success: true,
      message: '',
      data: data is Map<String, dynamic> ? data : <String, dynamic>{},
    );
  }
}

import 'package:dio/dio.dart';
import '../../core/constants/api_constants.dart';
import '../../api/models/api_response.dart';

class OrderRemoteDataSource {
  final Dio _dio;
  OrderRemoteDataSource(this._dio);

  Future<ApiResponse<Map<String, dynamic>>> getOrders({int page = 1, int limit = 10}) async {
    final response = await _dio.get(ApiConstants.orders, queryParameters: {'page': page, 'limit': limit});
    return ApiResponse(success: true, message: '', data: response.data as Map<String, dynamic>);
  }

  Future<ApiResponse<Map<String, dynamic>>> getOrder(String id) async {
    final response = await _dio.get('${ApiConstants.orders}/$id');
    return ApiResponse(success: true, message: '', data: response.data as Map<String, dynamic>);
  }

  Future<ApiResponse<Map<String, dynamic>>> createOrder({
    required String addressId,
    required String paymentMethod,
    String? couponCode,
    String? notes,
  }) async {
    final response = await _dio.post(ApiConstants.orders, data: {
      'address_id': addressId,
      'payment_method': paymentMethod,
      if (couponCode != null) 'coupon_code': couponCode,
      if (notes != null) 'notes': notes,
    });
    return ApiResponse(success: true, message: '', data: response.data as Map<String, dynamic>);
  }

  Future<ApiResponse<void>> cancelOrder(String id) async {
    final response = await _dio.patch('${ApiConstants.orders}/$id/cancel');
    return ApiResponse(success: true, message: '');
  }
}

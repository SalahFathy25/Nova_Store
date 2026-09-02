import 'package:dio/dio.dart';
import '../../core/constants/api_constants.dart';
import '../../api/models/api_response.dart';

class CartRemoteDataSource {
  final Dio _dio;
  CartRemoteDataSource(this._dio);

  Future<ApiResponse<Map<String, dynamic>>> getCart() async {
    final response = await _dio.get(ApiConstants.cart);
    return ApiResponse(success: true, message: '', data: response.data as Map<String, dynamic>);
  }

  Future<ApiResponse<Map<String, dynamic>>> addToCart({
    required String productId,
    String? variantId,
    int quantity = 1,
  }) async {
    final response = await _dio.post(ApiConstants.cartItems, data: {
      'product_id': productId,
      if (variantId != null) 'product_variant_id': variantId,
      'quantity': quantity,
    });
    return ApiResponse(success: true, message: '', data: response.data as Map<String, dynamic>);
  }

  Future<ApiResponse<Map<String, dynamic>>> updateCartItem(String itemId, int quantity) async {
    final response = await _dio.patch('${ApiConstants.cartItems}/$itemId', data: {
      'quantity': quantity,
    });
    return ApiResponse(success: true, message: '', data: response.data as Map<String, dynamic>);
  }

  Future<ApiResponse<void>> removeCartItem(String itemId) async {
    final response = await _dio.delete('${ApiConstants.cartItems}/$itemId');
    return ApiResponse(success: true, message: '');
  }

  Future<ApiResponse<void>> clearCart() async {
    final response = await _dio.delete(ApiConstants.cart);
    return ApiResponse(success: true, message: '');
  }
}

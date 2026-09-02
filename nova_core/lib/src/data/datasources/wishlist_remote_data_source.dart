import 'package:dio/dio.dart';
import '../../core/constants/api_constants.dart';
import '../../api/models/api_response.dart';

class WishlistRemoteDataSource {
  final Dio _dio;
  WishlistRemoteDataSource(this._dio);

  Future<ApiResponse<List<dynamic>>> getWishlist() async {
    final response = await _dio.get(ApiConstants.wishlist);
    final data = response.data;
    return ApiResponse(success: true, message: '', data: (data is List) ? data : <dynamic>[]);
  }

  Future<ApiResponse<Map<String, dynamic>>> addToWishlist(String productId) async {
    final response = await _dio.post(ApiConstants.wishlist, data: {'product_id': productId});
    return ApiResponse(success: true, message: '', data: response.data as Map<String, dynamic>);
  }

  Future<ApiResponse<void>> removeFromWishlist(String productId) async {
    final response = await _dio.delete('${ApiConstants.wishlist}/$productId');
    return ApiResponse(success: true, message: '');
  }
}

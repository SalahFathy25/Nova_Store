import 'package:dio/dio.dart';
import '../../core/constants/api_constants.dart';
import '../../api/models/api_response.dart';

class ReviewRemoteDataSource {
  final Dio _dio;
  ReviewRemoteDataSource(this._dio);

  Future<ApiResponse<Map<String, dynamic>>> getReviews(
    String productId, {
    int page = 1,
    int limit = 20,
  }) async {
    final response = await _dio.get(
      '${ApiConstants.reviews}/product/$productId',
      queryParameters: {'page': page, 'limit': limit},
    );
    final data = response.data;
    return ApiResponse(
      success: true,
      message: '',
      data: data is Map<String, dynamic> ? data : <String, dynamic>{},
    );
  }

  Future<ApiResponse<Map<String, dynamic>>> submitReview({
    required String productId,
    required int rating,
    String? title,
    String? comment,
    List<String>? images,
    String? orderId,
  }) async {
    final response = await _dio.post(ApiConstants.reviews, data: {
      'product_id': productId,
      'rating': rating,
      if (title != null) 'title': title,
      if (comment != null) 'comment': comment,
      if (images != null) 'images': images,
      if (orderId != null) 'order_id': orderId,
    });
    return ApiResponse(
      success: true,
      message: '',
      data: response.data as Map<String, dynamic>,
    );
  }

  Future<ApiResponse<void>> markHelpful(String reviewId) async {
    await _dio.patch('${ApiConstants.reviews}/$reviewId/helpful');
    return ApiResponse(success: true, message: '');
  }

  Future<ApiResponse<void>> deleteReview(String reviewId) async {
    await _dio.delete('${ApiConstants.reviews}/$reviewId');
    return ApiResponse(success: true, message: '');
  }
}

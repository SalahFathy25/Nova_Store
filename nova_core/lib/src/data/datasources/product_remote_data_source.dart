import 'package:dio/dio.dart';
import '../../core/constants/api_constants.dart';
import '../../api/models/api_response.dart';

class ProductRemoteDataSource {
  final Dio _dio;
  ProductRemoteDataSource(this._dio);

  Future<ApiResponse<Map<String, dynamic>>> getProducts({
    int page = 1,
    int limit = 20,
    String? search,
    String? categoryId,
    String? brandId,
    String? sortBy,
  }) async {
    final queryParams = {
      'page': page,
      'limit': limit,
      if (search != null) 'search': search,
      if (categoryId != null) 'category_id': categoryId,
      if (brandId != null) 'brand_id': brandId,
      if (sortBy != null) 'sort': sortBy,
    };
    final response = await _dio.get(ApiConstants.products, queryParameters: queryParams);
    return ApiResponse(success: true, message: '', data: response.data as Map<String, dynamic>);
  }

  Future<ApiResponse<Map<String, dynamic>>> getProduct(String id) async {
    final response = await _dio.get('${ApiConstants.products}/$id');
    return ApiResponse(success: true, message: '', data: response.data as Map<String, dynamic>);
  }

  Future<ApiResponse<List<dynamic>>> getCategories() async {
    final response = await _dio.get(ApiConstants.categories);
    final data = response.data;
    return ApiResponse(success: true, message: '', data: (data is List) ? data : <dynamic>[]);
  }

  Future<ApiResponse<List<dynamic>>> getBrands() async {
    final response = await _dio.get(ApiConstants.brands);
    final data = response.data;
    return ApiResponse(success: true, message: '', data: (data is List) ? data : <dynamic>[]);
  }

  Future<ApiResponse<List<dynamic>>> getSearchSuggestions({required String query}) async {
    try {
      final response = await _dio.get('/api/v1/catalog/suggestions', queryParameters: {'q': query});
      final data = response.data;
      return ApiResponse(success: true, message: '', data: (data is List) ? data : <dynamic>[]);
    } catch (_) {
      return ApiResponse(success: false, message: 'Failed to load suggestions', data: <dynamic>[]);
    }
  }

  Future<ApiResponse<List<dynamic>>> getPopularSearches() async {
    try {
      final response = await _dio.get('/api/v1/catalog/popular-searches');
      final data = response.data;
      return ApiResponse(success: true, message: '', data: (data is List) ? data : <dynamic>[]);
    } catch (_) {
      return ApiResponse(success: false, message: 'Failed to load popular searches', data: <dynamic>[]);
    }
  }

  Future<ApiResponse<Map<String, dynamic>>> getRelatedProducts({required String productId, int limit = 10}) async {
    try {
      final response = await _dio.get('${ApiConstants.products}/$productId/related', queryParameters: {'limit': limit});
      return ApiResponse(success: true, message: '', data: response.data as Map<String, dynamic>);
    } catch (_) {
      return ApiResponse(success: false, message: 'Failed to load related products', data: <String, dynamic>{});
    }
  }
}

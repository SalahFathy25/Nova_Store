import 'package:dio/dio.dart';
import '../../core/constants/api_constants.dart';
import '../../api/models/api_response.dart';

class HomeRemoteDataSource {
  final Dio _dio;
  HomeRemoteDataSource(this._dio);

  Future<ApiResponse<List<dynamic>>> getHomeSections() async {
    final response = await _dio.get(ApiConstants.home);
    final data = response.data;
    return ApiResponse(success: true, message: '', data: (data is List) ? data : <dynamic>[]);
  }

  Future<ApiResponse<List<dynamic>>> getBanners() async {
    final response = await _dio.get(ApiConstants.banners);
    final data = response.data;
    return ApiResponse(success: true, message: '', data: (data is List) ? data : <dynamic>[]);
  }
}

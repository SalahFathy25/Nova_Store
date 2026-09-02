import 'package:dio/dio.dart';
import '../../core/constants/api_constants.dart';
import '../../api/models/api_response.dart';

class NotificationRemoteDataSource {
  final Dio _dio;
  NotificationRemoteDataSource(this._dio);

  Future<ApiResponse<Map<String, dynamic>>> getNotifications({int page = 1, int limit = 20}) async {
    final response = await _dio.get(ApiConstants.notifications, queryParameters: {'page': page, 'limit': limit});
    return ApiResponse(success: true, message: '', data: response.data as Map<String, dynamic>);
  }

  Future<ApiResponse<int>> getUnreadCount() async {
    final response = await _dio.get('${ApiConstants.notifications}/unread-count');
    final data = response.data;
    final count = (data is Map) ? (data['count'] ?? 0) : 0;
    return ApiResponse(success: true, message: '', data: count as int);
  }

  Future<ApiResponse<void>> markAsRead(String id) async {
    final response = await _dio.patch('${ApiConstants.notifications}/$id/read');
    return ApiResponse(success: true, message: '');
  }

  Future<ApiResponse<void>> markAllAsRead() async {
    final response = await _dio.patch('${ApiConstants.notifications}/read-all');
    return ApiResponse(success: true, message: '');
  }
}

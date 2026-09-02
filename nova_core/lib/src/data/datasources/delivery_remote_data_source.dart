import 'package:dio/dio.dart';
import '../../core/constants/api_constants.dart';
import '../../api/models/api_response.dart';

class DeliveryRemoteDataSource {
  final Dio _dio;
  DeliveryRemoteDataSource(this._dio);

  // ─── Driver Profile ───────────────────────────────────────
  Future<ApiResponse<Map<String, dynamic>>> getMyProfile() async {
    final response = await _dio.get('${ApiConstants.delivery}/drivers/me');
    return ApiResponse(success: true, message: '', data: response.data as Map<String, dynamic>);
  }

  Future<ApiResponse<Map<String, dynamic>>> updateProfile(Map<String, dynamic> data) async {
    final response = await _dio.patch('${ApiConstants.delivery}/drivers/me', data: data);
    return ApiResponse(success: true, message: '', data: response.data as Map<String, dynamic>);
  }

  Future<ApiResponse<Map<String, dynamic>>> getDriverStats(String driverId) async {
    final response = await _dio.get('${ApiConstants.delivery}/drivers/$driverId/stats');
    return ApiResponse(success: true, message: '', data: response.data as Map<String, dynamic>);
  }

  Future<ApiResponse<List<dynamic>>> getAllDrivers() async {
    final response = await _dio.get('${ApiConstants.delivery}/drivers');
    return ApiResponse(success: true, message: '', data: response.data as List<dynamic>);
  }

  // ─── Shift Management ─────────────────────────────────────
  Future<ApiResponse<Map<String, dynamic>>> startShift() async {
    final response = await _dio.post('${ApiConstants.delivery}/shifts/start');
    return ApiResponse(success: true, message: '', data: response.data as Map<String, dynamic>);
  }

  Future<ApiResponse<Map<String, dynamic>>> endShift(String shiftId) async {
    final response = await _dio.patch('${ApiConstants.delivery}/shifts/$shiftId/end');
    return ApiResponse(success: true, message: '', data: response.data as Map<String, dynamic>);
  }

  Future<ApiResponse<Map<String, dynamic>?>> getActiveShift() async {
    final response = await _dio.get('${ApiConstants.delivery}/shifts/active');
    return ApiResponse(success: true, message: '', data: response.data as Map<String, dynamic>?);
  }

  Future<ApiResponse<Map<String, dynamic>>> getShiftHistory({int page = 1, int limit = 20}) async {
    final response = await _dio.get('${ApiConstants.delivery}/shifts/history', queryParameters: {'page': page, 'limit': limit});
    return ApiResponse(success: true, message: '', data: response.data as Map<String, dynamic>);
  }

  // ─── Location Tracking ────────────────────────────────────
  Future<ApiResponse<void>> updateLocation({
    required double latitude,
    required double longitude,
    double? speed,
    double? heading,
    String? subOrderId,
  }) async {
    final response = await _dio.post('${ApiConstants.delivery}/location', data: {
      'latitude': latitude,
      'longitude': longitude,
      if (speed != null) 'speed': speed,
      if (heading != null) 'heading': heading,
      if (subOrderId != null) 'sub_order_id': subOrderId,
    });
    return ApiResponse(success: true, message: '');
  }

  Future<ApiResponse<Map<String, dynamic>?>> getDriverLocation(String driverId) async {
    final response = await _dio.get('${ApiConstants.delivery}/location/$driverId');
    return ApiResponse(success: true, message: '', data: response.data as Map<String, dynamic>?);
  }

  // ─── Orders ───────────────────────────────────────────────
  Future<ApiResponse<List<dynamic>>> getMyOrders({String? status}) async {
    final response = await _dio.get('${ApiConstants.delivery}/orders/my', queryParameters: {if (status != null) 'status': status});
    return ApiResponse(success: true, message: '', data: response.data as List<dynamic>);
  }

  Future<ApiResponse<List<dynamic>>> getUnassignedOrders() async {
    final response = await _dio.get('${ApiConstants.delivery}/orders/unassigned');
    return ApiResponse(success: true, message: '', data: response.data as List<dynamic>);
  }

  Future<ApiResponse<Map<String, dynamic>>> updateOrderStatus(String subOrderId, String status, {String? notes}) async {
    final response = await _dio.patch('${ApiConstants.delivery}/orders/$subOrderId/status', data: {
      'status': status,
      if (notes != null) 'notes': notes,
    });
    return ApiResponse(success: true, message: '', data: response.data as Map<String, dynamic>);
  }

  Future<ApiResponse<Map<String, dynamic>>> assignDriver(String driverId, String subOrderId) async {
    final response = await _dio.post('${ApiConstants.delivery}/orders/assign', data: {
      'driver_id': driverId,
      'sub_order_id': subOrderId,
    });
    return ApiResponse(success: true, message: '', data: response.data as Map<String, dynamic>);
  }

  // ─── OTP Verification ─────────────────────────────────────
  Future<ApiResponse<Map<String, dynamic>>> verifyDeliveryOtp(String subOrderId, String otp) async {
    final response = await _dio.post('${ApiConstants.delivery}/orders/$subOrderId/verify-otp', data: {'otp': otp});
    return ApiResponse(success: true, message: '', data: response.data as Map<String, dynamic>);
  }

  // ─── Cash Ledger ──────────────────────────────────────────
  Future<ApiResponse<Map<String, dynamic>>> submitCash(double amount, {String? notes}) async {
    final response = await _dio.post('${ApiConstants.delivery}/cash/submit', data: {
      'amount': amount,
      if (notes != null) 'notes': notes,
    });
    return ApiResponse(success: true, message: '', data: response.data as Map<String, dynamic>);
  }

  Future<ApiResponse<List<dynamic>>> getCashLedger({String? shiftId}) async {
    final response = await _dio.get('${ApiConstants.delivery}/cash/ledger', queryParameters: {if (shiftId != null) 'shift_id': shiftId});
    return ApiResponse(success: true, message: '', data: response.data as List<dynamic>);
  }

  Future<ApiResponse<Map<String, dynamic>>> getCashSummary() async {
    final response = await _dio.get('${ApiConstants.delivery}/cash/summary');
    return ApiResponse(success: true, message: '', data: response.data as Map<String, dynamic>);
  }

  // ─── Delivery Zones ───────────────────────────────────────
  Future<ApiResponse<List<dynamic>>> getDeliveryZones() async {
    final response = await _dio.get('${ApiConstants.delivery}/zones');
    return ApiResponse(success: true, message: '', data: response.data as List<dynamic>);
  }
}

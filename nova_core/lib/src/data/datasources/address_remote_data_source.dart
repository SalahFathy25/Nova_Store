import 'package:dio/dio.dart';
import '../../core/constants/api_constants.dart';
import '../../api/models/api_response.dart';

class AddressRemoteDataSource {
  final Dio _dio;
  AddressRemoteDataSource(this._dio);

  Future<ApiResponse<List<dynamic>>> getAddresses() async {
    final response = await _dio.get(ApiConstants.addresses);
    final data = response.data;
    return ApiResponse(success: true, message: '', data: (data is List) ? data : <dynamic>[]);
  }

  Future<ApiResponse<Map<String, dynamic>>> createAddress(Map<String, dynamic> data) async {
    final response = await _dio.post(ApiConstants.addresses, data: data);
    return ApiResponse(success: true, message: '', data: response.data as Map<String, dynamic>);
  }

  Future<ApiResponse<Map<String, dynamic>>> updateAddress(String id, Map<String, dynamic> data) async {
    final response = await _dio.put('${ApiConstants.addresses}/$id', data: data);
    return ApiResponse(success: true, message: '', data: response.data as Map<String, dynamic>);
  }

  Future<ApiResponse<void>> deleteAddress(String id) async {
    final response = await _dio.delete('${ApiConstants.addresses}/$id');
    return ApiResponse(success: true, message: '');
  }

  Future<ApiResponse<void>> setDefaultAddress(String id) async {
    final response = await _dio.patch('${ApiConstants.addresses}/$id/default');
    return ApiResponse(success: true, message: '');
  }
}

import 'package:equatable/equatable.dart';

class PaginatedResponse<T> extends Equatable {
  final List<T> data;
  final int total;
  final int page;
  final int limit;
  final int totalPages;

  const PaginatedResponse({
    required this.data,
    required this.total,
    required this.page,
    required this.limit,
    required this.totalPages,
  });

  factory PaginatedResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Map<String, dynamic>) fromJsonT,
  ) {
    return PaginatedResponse(
      data: (json['data'] as List<dynamic>?)?.map((e) => fromJsonT(e as Map<String, dynamic>)).toList() ?? [],
      total: json['total'] ?? 0,
      page: json['page'] ?? 1,
      limit: json['limit'] ?? 20,
      totalPages: json['total_pages'] ?? 0,
    );
  }

  bool get hasNextPage => page < totalPages;
  bool get hasPreviousPage => page > 1;

  @override
  List<Object?> get props => [data, total, page, limit, totalPages];
}

class ApiResponse<T> extends Equatable {
  final bool success;
  final String message;
  final T? data;
  final String? error;

  const ApiResponse({
    this.success = false,
    this.message = '',
    this.data,
    this.error,
  });

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Map<String, dynamic>)? fromJsonT,
  ) {
    return ApiResponse(
      success: json['success'] ?? false,
      message: json['message'] ?? '',
      data: json['data'] != null && fromJsonT != null
          ? fromJsonT(json['data'])
          : json['data'],
      error: json['error'],
    );
  }

  @override
  List<Object?> get props => [success, message, data, error];
}

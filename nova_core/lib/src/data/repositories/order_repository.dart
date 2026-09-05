import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import '../../domain/failures/failures.dart';
import '../datasources/order_remote_data_source.dart';

class OrderRepository {
  final OrderRemoteDataSource _dataSource;

  OrderRepository(this._dataSource);

  Future<Either<Failure, Map<String, dynamic>>> getOrders({int page = 1, int limit = 10}) async {
    try {
      final response = await _dataSource.getOrders(page: page, limit: limit);
      if (response.success && response.data != null) {
        return Right(response.data!);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to load orders'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  Future<Either<Failure, Map<String, dynamic>>> getOrder(String id) async {
    try {
      final response = await _dataSource.getOrder(id);
      if (response.success && response.data != null) {
        return Right(response.data!);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to load order'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  Future<Either<Failure, Map<String, dynamic>>> createOrder({
    required String addressId,
    required String paymentMethod,
    String? couponCode,
    String? notes,
    String deliveryType = 'instant',
    String? scheduledTimeSlot,
    DateTime? scheduledDeliveryDate,
  }) async {
    try {
      final response = await _dataSource.createOrder(
        addressId: addressId,
        paymentMethod: paymentMethod,
        couponCode: couponCode,
        notes: notes,
        deliveryType: deliveryType,
        scheduledTimeSlot: scheduledTimeSlot,
        scheduledDeliveryDate: scheduledDeliveryDate?.toIso8601String(),
      );
      if (response.success && response.data != null) {
        return Right(response.data!);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to create order'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  Future<Either<Failure, void>> cancelOrder(String id) async {
    try {
      final response = await _dataSource.cancelOrder(id);
      if (response.success) {
        return const Right(null);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to cancel order'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}

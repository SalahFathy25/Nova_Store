import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import '../../domain/failures/failures.dart';
import '../datasources/notification_remote_data_source.dart';

class NotificationRepository {
  final NotificationRemoteDataSource _dataSource;

  NotificationRepository(this._dataSource);

  Future<Either<Failure, Map<String, dynamic>>> getNotifications({int page = 1, int limit = 20}) async {
    try {
      final response = await _dataSource.getNotifications(page: page, limit: limit);
      if (response.success && response.data != null) {
        return Right(response.data!);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to load notifications'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  Future<Either<Failure, int>> getUnreadCount() async {
    try {
      final response = await _dataSource.getUnreadCount();
      if (response.success && response.data != null) {
        return Right(response.data!);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to load unread count'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  Future<Either<Failure, void>> markAsRead(String id) async {
    try {
      final response = await _dataSource.markAsRead(id);
      if (response.success) {
        return const Right(null);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to mark as read'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  Future<Either<Failure, void>> markAllAsRead() async {
    try {
      final response = await _dataSource.markAllAsRead();
      if (response.success) {
        return const Right(null);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to mark all as read'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}

import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import '../../domain/failures/failures.dart';
import '../datasources/review_remote_data_source.dart';

class ReviewRepository {
  final ReviewRemoteDataSource _dataSource;

  ReviewRepository(this._dataSource);

  Future<Either<Failure, Map<String, dynamic>>> getReviews(
    String productId, {
    int page = 1,
    int limit = 20,
  }) async {
    try {
      final response = await _dataSource.getReviews(productId, page: page, limit: limit);
      if (response.success && response.data != null) {
        return Right(response.data!);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to load reviews'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  Future<Either<Failure, Map<String, dynamic>>> submitReview({
    required String productId,
    required int rating,
    String? title,
    String? comment,
    List<String>? images,
    String? orderId,
  }) async {
    try {
      final response = await _dataSource.submitReview(
        productId: productId,
        rating: rating,
        title: title,
        comment: comment,
        images: images,
        orderId: orderId,
      );
      if (response.success && response.data != null) {
        return Right(response.data!);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to submit review'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  Future<Either<Failure, void>> markHelpful(String reviewId) async {
    try {
      final response = await _dataSource.markHelpful(reviewId);
      if (response.success) {
        return const Right(null);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to mark helpful'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  Future<Either<Failure, void>> deleteReview(String reviewId) async {
    try {
      final response = await _dataSource.deleteReview(reviewId);
      if (response.success) {
        return const Right(null);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to delete review'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}

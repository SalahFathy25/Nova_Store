import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import '../../domain/failures/failures.dart';
import '../datasources/wishlist_remote_data_source.dart';

class WishlistRepository {
  final WishlistRemoteDataSource _dataSource;

  WishlistRepository(this._dataSource);

  Future<Either<Failure, List<dynamic>>> getWishlist() async {
    try {
      final response = await _dataSource.getWishlist();
      if (response.success && response.data != null) {
        return Right(response.data!);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to load wishlist'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  Future<Either<Failure, Map<String, dynamic>>> addToWishlist(String productId) async {
    try {
      final response = await _dataSource.addToWishlist(productId);
      if (response.success && response.data != null) {
        return Right(response.data!);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to add to wishlist'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  Future<Either<Failure, void>> removeFromWishlist(String productId) async {
    try {
      final response = await _dataSource.removeFromWishlist(productId);
      if (response.success) {
        return const Right(null);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to remove from wishlist'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}

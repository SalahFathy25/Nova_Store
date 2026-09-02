import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import '../../domain/failures/failures.dart';
import '../datasources/cart_remote_data_source.dart';

class CartRepository {
  final CartRemoteDataSource _dataSource;

  CartRepository(this._dataSource);

  Future<Either<Failure, Map<String, dynamic>>> getCart() async {
    try {
      final response = await _dataSource.getCart();
      if (response.success && response.data != null) {
        return Right(response.data!);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to load cart'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  Future<Either<Failure, Map<String, dynamic>>> addToCart({
    required String productId,
    String? variantId,
    int quantity = 1,
  }) async {
    try {
      final response = await _dataSource.addToCart(
        productId: productId,
        variantId: variantId,
        quantity: quantity,
      );
      if (response.success && response.data != null) {
        return Right(response.data!);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to add to cart'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  Future<Either<Failure, Map<String, dynamic>>> updateCartItem(String itemId, int quantity) async {
    try {
      final response = await _dataSource.updateCartItem(itemId, quantity);
      if (response.success && response.data != null) {
        return Right(response.data!);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to update cart item'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  Future<Either<Failure, void>> removeCartItem(String itemId) async {
    try {
      final response = await _dataSource.removeCartItem(itemId);
      if (response.success) {
        return const Right(null);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to remove cart item'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  Future<Either<Failure, void>> clearCart() async {
    try {
      final response = await _dataSource.clearCart();
      if (response.success) {
        return const Right(null);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to clear cart'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}

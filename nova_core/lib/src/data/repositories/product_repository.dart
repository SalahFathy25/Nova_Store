import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import '../../domain/failures/failures.dart';
import '../datasources/product_remote_data_source.dart';

class ProductRepository {
  final ProductRemoteDataSource _dataSource;

  ProductRepository(this._dataSource);

  Future<Either<Failure, Map<String, dynamic>>> getProducts({
    int page = 1,
    int limit = 20,
    String? search,
    String? categoryId,
    String? brandId,
    String? sortBy,
  }) async {
    try {
      final response = await _dataSource.getProducts(
        page: page,
        limit: limit,
        search: search,
        categoryId: categoryId,
        brandId: brandId,
        sortBy: sortBy,
      );
      if (response.success && response.data != null) {
        return Right(response.data!);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to load products'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  Future<Either<Failure, Map<String, dynamic>>> getProduct(String id) async {
    try {
      final response = await _dataSource.getProduct(id);
      if (response.success && response.data != null) {
        return Right(response.data!);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to load product'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  Future<Either<Failure, List<dynamic>>> getCategories() async {
    try {
      final response = await _dataSource.getCategories();
      if (response.success && response.data != null) {
        return Right(response.data!);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to load categories'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  Future<Either<Failure, List<dynamic>>> getBrands() async {
    try {
      final response = await _dataSource.getBrands();
      if (response.success && response.data != null) {
        return Right(response.data!);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to load brands'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  Future<Either<Failure, List<dynamic>>> getSearchSuggestions({required String query}) async {
    try {
      final response = await _dataSource.getSearchSuggestions(query: query);
      if (response.success && response.data != null) {
        return Right(response.data!);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to load suggestions'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  Future<Either<Failure, List<dynamic>>> getPopularSearches() async {
    try {
      final response = await _dataSource.getPopularSearches();
      if (response.success && response.data != null) {
        return Right(response.data!);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to load popular searches'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  Future<Either<Failure, Map<String, dynamic>>> getRelatedProducts({required String productId, int limit = 10}) async {
    try {
      final response = await _dataSource.getRelatedProducts(productId: productId, limit: limit);
      if (response.success && response.data != null) {
        return Right(response.data!);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to load related products'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}

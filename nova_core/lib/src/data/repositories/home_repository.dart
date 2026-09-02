import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import '../../domain/failures/failures.dart';
import '../datasources/home_remote_data_source.dart';

class HomeRepository {
  final HomeRemoteDataSource _dataSource;

  HomeRepository(this._dataSource);

  Future<Either<Failure, List<dynamic>>> getHomeSections() async {
    try {
      final response = await _dataSource.getHomeSections();
      if (response.success && response.data != null) {
        return Right(response.data!);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to load home data'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  Future<Either<Failure, List<dynamic>>> getBanners() async {
    try {
      final response = await _dataSource.getBanners();
      if (response.success && response.data != null) {
        return Right(response.data!);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to load banners'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}

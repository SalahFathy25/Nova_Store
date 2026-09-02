import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import '../../domain/failures/failures.dart';
import '../datasources/address_remote_data_source.dart';

class AddressRepository {
  final AddressRemoteDataSource _dataSource;

  AddressRepository(this._dataSource);

  Future<Either<Failure, List<dynamic>>> getAddresses() async {
    try {
      final response = await _dataSource.getAddresses();
      if (response.success && response.data != null) {
        return Right(response.data!);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to load addresses'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  Future<Either<Failure, Map<String, dynamic>>> createAddress(Map<String, dynamic> data) async {
    try {
      final response = await _dataSource.createAddress(data);
      if (response.success && response.data != null) {
        return Right(response.data!);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to create address'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  Future<Either<Failure, Map<String, dynamic>>> updateAddress(String id, Map<String, dynamic> data) async {
    try {
      final response = await _dataSource.updateAddress(id, data);
      if (response.success && response.data != null) {
        return Right(response.data!);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to update address'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  Future<Either<Failure, void>> deleteAddress(String id) async {
    try {
      final response = await _dataSource.deleteAddress(id);
      if (response.success) {
        return const Right(null);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to delete address'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  Future<Either<Failure, void>> setDefaultAddress(String id) async {
    try {
      final response = await _dataSource.setDefaultAddress(id);
      if (response.success) {
        return const Right(null);
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to set default address'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}

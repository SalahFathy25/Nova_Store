import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import '../../domain/entities/coupon.dart';
import '../../domain/failures/failures.dart';
import '../datasources/coupon_remote_data_source.dart';

class CouponRepository {
  final CouponRemoteDataSource _dataSource;

  CouponRepository(this._dataSource);

  Future<Either<Failure, CouponValidation>> validateCoupon({
    required String code,
    required double subtotal,
  }) async {
    try {
      final response = await _dataSource.validateCoupon(code: code, subtotal: subtotal);
      if (response.success && response.data != null) {
        return Right(CouponValidation.fromJson(response.data!));
      }
      return Left(ServerFailure(message: response.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Failed to validate coupon'));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}

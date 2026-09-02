import 'package:get_it/get_it.dart';
import 'package:nova_core/nova_core.dart' hide AppConfig;
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../presentation/providers/auth_provider.dart';
import '../../presentation/providers/shift_provider.dart';
import '../../presentation/providers/order_provider.dart';
import '../../presentation/providers/location_provider.dart';
import '../services/socket_service.dart';
import '../services/location_service.dart';
import '../config/app_config.dart';

final getIt = GetIt.instance;

Future<void> configureDependencies() async {
  final storage = const FlutterSecureStorage();
  final dio = Dio(BaseOptions(
    baseUrl: AppConfig.apiBaseUrl,
    connectTimeout: const Duration(seconds: 30),
    receiveTimeout: const Duration(seconds: 30),
  ));

  final accessToken = await storage.read(key: ApiConstants.accessTokenKey);
  if (accessToken != null) {
    dio.options.headers['Authorization'] = 'Bearer $accessToken';
  }
  dio.options.headers['X-Tenant-ID'] = AppConfig.defaultTenantId;

  getIt.registerLazySingleton(() => storage);
  getIt.registerLazySingleton(() => dio);
  getIt.registerLazySingleton(() => DeliveryRemoteDataSource(dio));
  getIt.registerLazySingleton(() => SocketService());
  getIt.registerLazySingleton(() => LocationService());

  getIt.registerFactory(() => AuthProvider(
    remoteDataSource: getIt<DeliveryRemoteDataSource>(),
    storage: getIt<FlutterSecureStorage>(),
    dio: getIt<Dio>(),
  ));
  getIt.registerFactory(() => ShiftProvider(
    remoteDataSource: getIt<DeliveryRemoteDataSource>(),
  ));
  getIt.registerFactory(() => OrderProvider(
    remoteDataSource: getIt<DeliveryRemoteDataSource>(),
  ));
  getIt.registerFactory(() => LocationProvider(
    remoteDataSource: getIt<DeliveryRemoteDataSource>(),
    locationService: getIt<LocationService>(),
    socketService: getIt<SocketService>(),
  ));
}

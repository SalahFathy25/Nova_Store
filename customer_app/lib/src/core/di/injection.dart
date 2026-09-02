import 'package:get_it/get_it.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:nova_core/nova_core.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../features/auth/bloc/auth_bloc.dart';
import '../../features/auth/bloc/auth_event.dart';
import '../../features/home/bloc/home_bloc.dart';
import '../../features/home/bloc/home_event.dart';
import '../../features/products/bloc/product_bloc.dart';
import '../../features/cart/bloc/cart_bloc.dart';
import '../../features/cart/bloc/cart_event.dart';
import '../../features/orders/bloc/order_bloc.dart';
import '../../features/addresses/bloc/address_bloc.dart';
import '../../features/wishlist/bloc/wishlist_bloc.dart';
import '../../features/notifications/bloc/notification_bloc.dart';
import '../../features/notifications/bloc/notification_event.dart';
import '../../features/profile/bloc/profile_bloc.dart';
import '../../features/app_config/app_config_cubit.dart';

final getIt = GetIt.instance;

void configureDependencies(SharedPreferences prefs) {
  // Core
  getIt.registerLazySingleton<LocalStorage>(() => LocalStorage(prefs));
  getIt.registerLazySingleton<NovaApiClient>(() => NovaApiClient(prefs));

  // DataSources
  getIt.registerLazySingleton<HomeRemoteDataSource>(
    () => HomeRemoteDataSource(getIt<NovaApiClient>().dio),
  );
  getIt.registerLazySingleton<ProductRemoteDataSource>(
    () => ProductRemoteDataSource(getIt<NovaApiClient>().dio),
  );
  getIt.registerLazySingleton<CartRemoteDataSource>(
    () => CartRemoteDataSource(getIt<NovaApiClient>().dio),
  );
  getIt.registerLazySingleton<OrderRemoteDataSource>(
    () => OrderRemoteDataSource(getIt<NovaApiClient>().dio),
  );
  getIt.registerLazySingleton<AddressRemoteDataSource>(
    () => AddressRemoteDataSource(getIt<NovaApiClient>().dio),
  );
  getIt.registerLazySingleton<WishlistRemoteDataSource>(
    () => WishlistRemoteDataSource(getIt<NovaApiClient>().dio),
  );
  getIt.registerLazySingleton<NotificationRemoteDataSource>(
    () => NotificationRemoteDataSource(getIt<NovaApiClient>().dio),
  );

  // Repositories
  getIt.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(getIt<NovaApiClient>().dio, getIt<LocalStorage>()),
  );
  getIt.registerLazySingleton<HomeRepository>(
    () => HomeRepository(getIt<HomeRemoteDataSource>()),
  );
  getIt.registerLazySingleton<ProductRepository>(
    () => ProductRepository(getIt<ProductRemoteDataSource>()),
  );
  getIt.registerLazySingleton<CartRepository>(
    () => CartRepository(getIt<CartRemoteDataSource>()),
  );
  getIt.registerLazySingleton<OrderRepository>(
    () => OrderRepository(getIt<OrderRemoteDataSource>()),
  );
  getIt.registerLazySingleton<AddressRepository>(
    () => AddressRepository(getIt<AddressRemoteDataSource>()),
  );
  getIt.registerLazySingleton<WishlistRepository>(
    () => WishlistRepository(getIt<WishlistRemoteDataSource>()),
  );
  getIt.registerLazySingleton<NotificationRepository>(
    () => NotificationRepository(getIt<NotificationRemoteDataSource>()),
  );
  getIt.registerLazySingleton<AppConfigRepository>(
    () => AppConfigRepository(getIt<NovaApiClient>().dio),
  );

  // BLoCs
  getIt.registerFactory<AuthBloc>(
    () => AuthBloc(
      authRepository: getIt<AuthRepository>(),
      localStorage: getIt<LocalStorage>(),
    ),
  );
  getIt.registerFactory<HomeBloc>(
    () => HomeBloc(homeRepository: getIt<HomeRepository>()),
  );
  getIt.registerFactory<ProductBloc>(
    () => ProductBloc(productRepository: getIt<ProductRepository>()),
  );
  getIt.registerFactory<CartBloc>(
    () => CartBloc(cartRepository: getIt<CartRepository>()),
  );
  getIt.registerFactory<OrderBloc>(
    () => OrderBloc(orderRepository: getIt<OrderRepository>()),
  );
  getIt.registerFactory<AddressBloc>(
    () => AddressBloc(addressRepository: getIt<AddressRepository>()),
  );
  getIt.registerFactory<WishlistBloc>(
    () => WishlistBloc(wishlistRepository: getIt<WishlistRepository>()),
  );
  getIt.registerFactory<NotificationBloc>(
    () => NotificationBloc(notificationRepository: getIt<NotificationRepository>()),
  );
  getIt.registerFactory<ProfileBloc>(
    () => ProfileBloc(authRepository: getIt<AuthRepository>()),
  );
  getIt.registerFactory<AppConfigCubit>(
    () => AppConfigCubit(repository: getIt<AppConfigRepository>()),
  );
}

List<BlocProvider> get appBLoCs => [
      BlocProvider<AuthBloc>(
        create: (_) => getIt<AuthBloc>()..add(const AuthCheckStatus()),
      ),
      BlocProvider<HomeBloc>(
        create: (_) => getIt<HomeBloc>()..add(const LoadHome()),
      ),
      BlocProvider<CartBloc>(
        create: (_) => getIt<CartBloc>()..add(const LoadCart()),
      ),
      BlocProvider<NotificationBloc>(
        create: (_) => getIt<NotificationBloc>()..add(const LoadUnreadCount()),
      ),
    ];

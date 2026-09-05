import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'firebase_options.dart';
import 'src/core/di/injection.dart';
import 'src/core/services/push_notification_service.dart';
import 'src/app/app.dart';
import 'src/features/auth/bloc/auth_bloc.dart';
import 'src/features/auth/bloc/auth_event.dart';
import 'src/features/home/bloc/home_bloc.dart';
import 'src/features/home/bloc/home_event.dart';
import 'src/features/products/bloc/product_bloc.dart';
import 'src/features/products/bloc/product_event.dart';
import 'src/features/cart/bloc/cart_bloc.dart';
import 'src/features/cart/bloc/cart_event.dart';
import 'src/features/wishlist/bloc/wishlist_bloc.dart';
import 'src/features/wishlist/bloc/wishlist_event.dart';
import 'src/features/profile/bloc/profile_bloc.dart';
import 'src/features/profile/bloc/profile_event.dart';
import 'src/features/orders/bloc/order_bloc.dart';
import 'src/features/orders/bloc/order_event.dart';
import 'src/features/addresses/bloc/address_bloc.dart';
import 'src/features/addresses/bloc/address_event.dart';
import 'src/features/notifications/bloc/notification_bloc.dart';
import 'src/features/notifications/bloc/notification_event.dart';
import 'src/features/app_config/app_config_cubit.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  try {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
  } catch (_) {}

  FlutterError.onError = (details) {
    if (kDebugMode) {
      FlutterError.presentError(details);
    }
  };

  final prefs = await SharedPreferences.getInstance();
  configureDependencies(prefs);

  try {
    getIt<PushNotificationService>().initialize();
  } catch (_) {}

  runApp(
    BlocProvider<AppConfigCubit>(
      create: (_) => getIt<AppConfigCubit>()..loadConfig(),
      child: MultiBlocProvider(
        providers: [
          BlocProvider<AuthBloc>(
            create: (_) => getIt<AuthBloc>()..add(const AuthCheckStatus()),
          ),
          BlocProvider<HomeBloc>(
            create: (_) => getIt<HomeBloc>()..add(const LoadHome()),
          ),
          BlocProvider<ProductBloc>(
            create: (_) => getIt<ProductBloc>()..add(const LoadProducts()),
          ),
          BlocProvider<CartBloc>(
            create: (_) => getIt<CartBloc>()..add(const LoadCart()),
          ),
          BlocProvider<WishlistBloc>(
            create: (_) => getIt<WishlistBloc>()..add(const LoadWishlist()),
          ),
          BlocProvider<ProfileBloc>(
            create: (_) => getIt<ProfileBloc>()..add(const LoadProfile()),
          ),
          BlocProvider<OrderBloc>(
            create: (_) => getIt<OrderBloc>()..add(const LoadOrders()),
          ),
          BlocProvider<AddressBloc>(
            create: (_) => getIt<AddressBloc>()..add(const LoadAddresses()),
          ),
          BlocProvider<NotificationBloc>(
            create: (_) => getIt<NotificationBloc>()..add(const LoadUnreadCount()),
          ),
        ],
        child: const CustomerApp(),
      ),
    ),
  );
}

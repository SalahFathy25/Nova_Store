import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'src/core/di/injection.dart';
import 'src/app/app.dart';
import 'src/features/auth/bloc/auth_bloc.dart';
import 'src/features/auth/bloc/auth_event.dart';
import 'src/features/home/bloc/home_bloc.dart';
import 'src/features/home/bloc/home_event.dart';
import 'src/features/products/bloc/product_bloc.dart';
import 'src/features/products/bloc/product_event.dart';
import 'src/features/cart/bloc/cart_bloc.dart';
import 'src/features/cart/bloc/cart_event.dart';
import 'src/features/notifications/bloc/notification_bloc.dart';
import 'src/features/notifications/bloc/notification_event.dart';
import 'src/features/app_config/app_config_cubit.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  FlutterError.onError = (details) {
    if (kDebugMode) {
      FlutterError.presentError(details);
    }
  };

  final prefs = await SharedPreferences.getInstance();
  configureDependencies(prefs);

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
          BlocProvider<NotificationBloc>(
            create: (_) => getIt<NotificationBloc>()..add(const LoadUnreadCount()),
          ),
        ],
        child: const CustomerApp(),
      ),
    ),
  );
}

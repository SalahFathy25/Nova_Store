import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nova_core/nova_core.dart';
import 'main_shell.dart';
import '../core/router/app_router.dart';
import '../features/auth/bloc/auth_bloc.dart';
import '../features/auth/bloc/auth_state.dart';
import '../features/auth/pages/login_page.dart';

class CustomerApp extends StatelessWidget {
  const CustomerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NOVA Commerce',
      debugShowCheckedModeBanner: false,
      theme: NovaTheme.lightTheme,
      home: BlocListener<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is AuthAuthenticated) {
            Navigator.of(context).pushReplacementNamed(AppRouter.root);
          } else if (state is AuthUnauthenticated) {
            Navigator.of(context).pushReplacementNamed(AppRouter.login);
          }
        },
        child: BlocBuilder<AuthBloc, AuthState>(
          builder: (context, state) {
            if (state is AuthInitial || state is AuthLoading) {
              return const Scaffold(
                body: Center(child: CircularProgressIndicator()),
              );
            }
            if (state is AuthAuthenticated) {
              return const MainShell();
            }
            return const LoginPage();
          },
        ),
      ),
      onGenerateRoute: AppRouter.generateRoute,
    );
  }
}

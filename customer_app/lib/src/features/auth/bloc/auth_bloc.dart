import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nova_core/nova_core.dart';
import 'auth_event.dart';
import 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRepository _authRepository;
  final LocalStorage _localStorage;

  AuthBloc({
    required AuthRepository authRepository,
    required LocalStorage localStorage,
  })  : _authRepository = authRepository,
        _localStorage = localStorage,
        super(AuthInitial()) {
    on<AuthLogin>(_onLogin);
    on<AuthRegister>(_onRegister);
    on<AuthSendOtp>(_onSendOtp);
    on<AuthVerifyOtp>(_onVerifyOtp);
    on<AuthCheckStatus>(_onCheckStatus);
    on<AuthLogout>(_onLogout);
    on<AuthForgotPassword>(_onForgotPassword);
  }

  Future<void> _onLogin(AuthLogin event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    final tenantId = _localStorage.getTenantId() ?? ApiConstants.defaultTenantId;
    final result = await _authRepository.login(
      email: event.email,
      password: event.password,
      tenantId: tenantId,
    );
    result.fold(
      (failure) => emit(AuthError(message: failure.message)),
      (authResponse) => emit(AuthAuthenticated(user: authResponse.user)),
    );
  }

  Future<void> _onRegister(AuthRegister event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    final tenantId = _localStorage.getTenantId() ?? ApiConstants.defaultTenantId;
    final result = await _authRepository.register(
      fullName: event.fullName,
      email: event.email,
      password: event.password,
      tenantId: tenantId,
    );
    result.fold(
      (failure) => emit(AuthError(message: failure.message)),
      (authResponse) => emit(AuthAuthenticated(user: authResponse.user)),
    );
  }

  Future<void> _onSendOtp(AuthSendOtp event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    final tenantId = _localStorage.getTenantId() ?? ApiConstants.defaultTenantId;
    final result = await _authRepository.sendOtp(
      phone: event.phone,
      tenantId: tenantId,
    );
    result.fold(
      (failure) => emit(AuthError(message: failure.message)),
      (_) => emit(AuthOtpSent(phone: event.phone)),
    );
  }

  Future<void> _onVerifyOtp(AuthVerifyOtp event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    final tenantId = _localStorage.getTenantId() ?? ApiConstants.defaultTenantId;
    final result = await _authRepository.verifyOtp(
      phone: event.phone,
      code: event.code,
      tenantId: tenantId,
    );
    result.fold(
      (failure) => emit(AuthError(message: failure.message)),
      (authResponse) => emit(AuthAuthenticated(user: authResponse.user)),
    );
  }

  Future<void> _onCheckStatus(AuthCheckStatus event, Emitter<AuthState> emit) async {
    if (_localStorage.isLoggedIn) {
      emit(AuthLoading());
      final result = await _authRepository.getProfile();
      result.fold(
        (failure) {
          _localStorage.clearTokens();
          emit(AuthUnauthenticated());
        },
        (user) => emit(AuthAuthenticated(user: user)),
      );
    } else {
      emit(AuthUnauthenticated());
    }
  }

  Future<void> _onLogout(AuthLogout event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    await _authRepository.logout();
    emit(AuthUnauthenticated());
  }

  Future<void> _onForgotPassword(AuthForgotPassword event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    final result = await _authRepository.forgotPassword(email: event.email);
    result.fold(
      (failure) => emit(AuthError(message: failure.message)),
      (_) => emit(AuthInitial()),
    );
  }
}

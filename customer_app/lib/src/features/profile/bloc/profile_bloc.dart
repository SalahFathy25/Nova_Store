import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nova_core/nova_core.dart';
import 'profile_event.dart';
import 'profile_state.dart';

class ProfileBloc extends Bloc<ProfileEvent, ProfileState> {
  final AuthRepository _authRepository;

  ProfileBloc({required AuthRepository authRepository})
      : _authRepository = authRepository,
        super(ProfileInitial()) {
    on<LoadProfile>(_onLoadProfile);
  }

  Future<void> _onLoadProfile(LoadProfile event, Emitter<ProfileState> emit) async {
    emit(ProfileLoading());
    final result = await _authRepository.getProfile();
    result.fold(
      (failure) => emit(ProfileError(message: failure.message)),
      (user) => emit(ProfileLoaded(user: user)),
    );
  }
}

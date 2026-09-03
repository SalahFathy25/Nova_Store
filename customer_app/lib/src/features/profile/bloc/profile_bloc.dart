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
    on<UpdateProfile>(_onUpdateProfile);
  }

  Future<void> _onLoadProfile(LoadProfile event, Emitter<ProfileState> emit) async {
    emit(ProfileLoading());
    final result = await _authRepository.getProfile();
    result.fold(
      (failure) => emit(ProfileError(message: failure.message)),
      (user) => emit(ProfileLoaded(user: user)),
    );
  }

  Future<void> _onUpdateProfile(UpdateProfile event, Emitter<ProfileState> emit) async {
    final currentUser = state is ProfileLoaded ? (state as ProfileLoaded).user : null;
    if (currentUser != null) {
      emit(ProfileUpdating(user: currentUser));
    }

    final result = await _authRepository.updateProfile(
      fullName: event.fullName,
      email: event.email,
      phone: event.phone,
    );
    result.fold(
      (failure) => emit(ProfileError(message: failure.message)),
      (user) => emit(ProfileUpdated(user: user)),
    );
  }
}

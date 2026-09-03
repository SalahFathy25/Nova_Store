import 'package:equatable/equatable.dart';
import 'package:nova_core/nova_core.dart';

abstract class ProfileState extends Equatable {
  const ProfileState();

  @override
  List<Object?> get props => [];
}

class ProfileInitial extends ProfileState {}

class ProfileLoading extends ProfileState {}

class ProfileLoaded extends ProfileState {
  final User user;

  const ProfileLoaded({required this.user});

  @override
  List<Object?> get props => [user.id, user.fullName];
}

class ProfileUpdating extends ProfileState {
  final User user;

  const ProfileUpdating({required this.user});

  @override
  List<Object?> get props => [user.id];
}

class ProfileUpdated extends ProfileState {
  final User user;
  final String message;

  const ProfileUpdated({required this.user, this.message = 'Profile updated successfully'});

  @override
  List<Object?> get props => [user.id, message];
}

class ProfileError extends ProfileState {
  final String message;

  const ProfileError({required this.message});

  @override
  List<Object?> get props => [message];
}

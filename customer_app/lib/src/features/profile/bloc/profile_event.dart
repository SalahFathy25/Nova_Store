import 'package:equatable/equatable.dart';

abstract class ProfileEvent extends Equatable {
  const ProfileEvent();

  @override
  List<Object?> get props => [];
}

class LoadProfile extends ProfileEvent {
  const LoadProfile();
}

class UpdateProfile extends ProfileEvent {
  final String? fullName;
  final String? email;
  final String? phone;

  const UpdateProfile({this.fullName, this.email, this.phone});

  @override
  List<Object?> get props => [fullName, email, phone];
}

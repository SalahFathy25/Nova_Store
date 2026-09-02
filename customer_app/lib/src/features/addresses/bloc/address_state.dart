import 'package:equatable/equatable.dart';

abstract class AddressState extends Equatable {
  const AddressState();

  @override
  List<Object?> get props => [];
}

class AddressInitial extends AddressState {}

class AddressLoading extends AddressState {}

class AddressesLoaded extends AddressState {
  final List<dynamic> addresses;

  const AddressesLoaded({required this.addresses});

  @override
  List<Object?> get props => [addresses];
}

class AddressOperationSuccess extends AddressState {
  final String message;

  const AddressOperationSuccess({required this.message});

  @override
  List<Object?> get props => [message];
}

class AddressError extends AddressState {
  final String message;

  const AddressError({required this.message});

  @override
  List<Object?> get props => [message];
}

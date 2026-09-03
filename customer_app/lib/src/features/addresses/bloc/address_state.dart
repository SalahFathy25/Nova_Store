import 'package:equatable/equatable.dart';
import 'package:nova_core/nova_core.dart';

abstract class AddressState extends Equatable {
  const AddressState();

  @override
  List<Object?> get props => [];
}

class AddressInitial extends AddressState {}

class AddressLoading extends AddressState {}

class AddressesLoaded extends AddressState {
  final List<Address> addresses;

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

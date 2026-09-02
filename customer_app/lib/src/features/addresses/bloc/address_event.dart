import 'package:equatable/equatable.dart';

abstract class AddressEvent extends Equatable {
  const AddressEvent();

  @override
  List<Object?> get props => [];
}

class LoadAddresses extends AddressEvent {
  const LoadAddresses();
}

class AddAddress extends AddressEvent {
  final Map<String, dynamic> addressData;

  const AddAddress({required this.addressData});

  @override
  List<Object?> get props => [addressData];
}

class UpdateAddress extends AddressEvent {
  final String id;
  final Map<String, dynamic> addressData;

  const UpdateAddress({required this.id, required this.addressData});

  @override
  List<Object?> get props => [id, addressData];
}

class DeleteAddress extends AddressEvent {
  final String id;

  const DeleteAddress({required this.id});

  @override
  List<Object?> get props => [id];
}

class SetDefaultAddress extends AddressEvent {
  final String id;

  const SetDefaultAddress({required this.id});

  @override
  List<Object?> get props => [id];
}

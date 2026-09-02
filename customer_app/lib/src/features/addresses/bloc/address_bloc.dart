import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nova_core/nova_core.dart';
import 'address_event.dart';
import 'address_state.dart';

class AddressBloc extends Bloc<AddressEvent, AddressState> {
  final AddressRepository _addressRepository;

  AddressBloc({required AddressRepository addressRepository})
      : _addressRepository = addressRepository,
        super(AddressInitial()) {
    on<LoadAddresses>(_onLoadAddresses);
    on<AddAddress>(_onAddAddress);
    on<UpdateAddress>(_onUpdateAddress);
    on<DeleteAddress>(_onDeleteAddress);
    on<SetDefaultAddress>(_onSetDefaultAddress);
  }

  Future<void> _onLoadAddresses(LoadAddresses event, Emitter<AddressState> emit) async {
    emit(AddressLoading());
    final result = await _addressRepository.getAddresses();
    result.fold(
      (failure) => emit(AddressError(message: failure.message)),
      (addresses) => emit(AddressesLoaded(addresses: addresses)),
    );
  }

  Future<void> _onAddAddress(AddAddress event, Emitter<AddressState> emit) async {
    emit(AddressLoading());
    final result = await _addressRepository.createAddress(event.addressData);
    result.fold(
      (failure) => emit(AddressError(message: failure.message)),
      (_) => add(const LoadAddresses()),
    );
  }

  Future<void> _onUpdateAddress(UpdateAddress event, Emitter<AddressState> emit) async {
    emit(AddressLoading());
    final result = await _addressRepository.updateAddress(event.id, event.addressData);
    result.fold(
      (failure) => emit(AddressError(message: failure.message)),
      (_) => add(const LoadAddresses()),
    );
  }

  Future<void> _onDeleteAddress(DeleteAddress event, Emitter<AddressState> emit) async {
    emit(AddressLoading());
    final result = await _addressRepository.deleteAddress(event.id);
    result.fold(
      (failure) => emit(AddressError(message: failure.message)),
      (_) => add(const LoadAddresses()),
    );
  }

  Future<void> _onSetDefaultAddress(SetDefaultAddress event, Emitter<AddressState> emit) async {
    emit(AddressLoading());
    final result = await _addressRepository.setDefaultAddress(event.id);
    result.fold(
      (failure) => emit(AddressError(message: failure.message)),
      (_) => add(const LoadAddresses()),
    );
  }
}

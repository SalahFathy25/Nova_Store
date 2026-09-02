import 'package:equatable/equatable.dart';

abstract class CartState extends Equatable {
  const CartState();

  @override
  List<Object?> get props => [];
}

class CartInitial extends CartState {}

class CartLoading extends CartState {}

class CartLoaded extends CartState {
  final Map<String, dynamic> cart;

  const CartLoaded({required this.cart});

  int get itemCount => (cart['items'] as List?)?.length ?? 0;
  double get subtotal => (cart['subtotal'] as num?)?.toDouble() ?? 0;
  double get total => (cart['total'] as num?)?.toDouble() ?? 0;

  @override
  List<Object?> get props => [cart];
}

class CartError extends CartState {
  final String message;

  const CartError({required this.message});

  @override
  List<Object?> get props => [message];
}

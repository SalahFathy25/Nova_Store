import 'package:equatable/equatable.dart';
import 'package:nova_core/nova_core.dart';

abstract class CartState extends Equatable {
  const CartState();

  @override
  List<Object?> get props => [];
}

class CartInitial extends CartState {}

class CartLoading extends CartState {}

class CartLoaded extends CartState {
  final Cart cart;

  const CartLoaded({required this.cart});

  List<CartItem> get cartItems => cart.items;
  int get itemCount => cart.itemCount;
  double get subtotal => cart.subtotal;
  double get total => cart.total;

  @override
  List<Object?> get props => [cart];
}

class CartError extends CartState {
  final String message;

  const CartError({required this.message});

  @override
  List<Object?> get props => [message];
}

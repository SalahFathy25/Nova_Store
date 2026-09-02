import 'package:equatable/equatable.dart';

abstract class CartEvent extends Equatable {
  const CartEvent();

  @override
  List<Object?> get props => [];
}

class LoadCart extends CartEvent {
  const LoadCart();
}

class AddToCart extends CartEvent {
  final String productId;
  final String? variantId;
  final int quantity;

  const AddToCart({required this.productId, this.variantId, this.quantity = 1});

  @override
  List<Object?> get props => [productId, variantId, quantity];
}

class UpdateCartItem extends CartEvent {
  final String itemId;
  final int quantity;

  const UpdateCartItem({required this.itemId, required this.quantity});

  @override
  List<Object?> get props => [itemId, quantity];
}

class RemoveFromCart extends CartEvent {
  final String itemId;

  const RemoveFromCart({required this.itemId});

  @override
  List<Object?> get props => [itemId];
}

class ClearCart extends CartEvent {
  const ClearCart();
}

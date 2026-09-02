import 'package:equatable/equatable.dart';

abstract class WishlistEvent extends Equatable {
  const WishlistEvent();

  @override
  List<Object?> get props => [];
}

class LoadWishlist extends WishlistEvent {
  const LoadWishlist();
}

class AddToWishlist extends WishlistEvent {
  final String productId;

  const AddToWishlist({required this.productId});

  @override
  List<Object?> get props => [productId];
}

class RemoveFromWishlist extends WishlistEvent {
  final String productId;

  const RemoveFromWishlist({required this.productId});

  @override
  List<Object?> get props => [productId];
}

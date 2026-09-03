import 'package:equatable/equatable.dart';
import 'package:nova_core/nova_core.dart';

abstract class WishlistState extends Equatable {
  const WishlistState();

  @override
  List<Object?> get props => [];
}

class WishlistInitial extends WishlistState {}

class WishlistLoading extends WishlistState {}

class WishlistLoaded extends WishlistState {
  final List<WishlistItem> items;

  const WishlistLoaded({required this.items});

  int get itemCount => items.length;

  List<String> get productIds => items.map((item) => item.productId).toList();

  bool isProductWishlisted(String productId) => productIds.contains(productId);

  @override
  List<Object?> get props => [items];
}

class WishlistError extends WishlistState {
  final String message;

  const WishlistError({required this.message});

  @override
  List<Object?> get props => [message];
}

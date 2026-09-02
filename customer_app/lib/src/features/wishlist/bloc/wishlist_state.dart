import 'package:equatable/equatable.dart';

abstract class WishlistState extends Equatable {
  const WishlistState();

  @override
  List<Object?> get props => [];
}

class WishlistInitial extends WishlistState {}

class WishlistLoading extends WishlistState {}

class WishlistLoaded extends WishlistState {
  final List<dynamic> items;

  const WishlistLoaded({required this.items});

  int get itemCount => items.length;

  @override
  List<Object?> get props => [items];
}

class WishlistError extends WishlistState {
  final String message;

  const WishlistError({required this.message});

  @override
  List<Object?> get props => [message];
}

import 'package:equatable/equatable.dart';

abstract class ProductState extends Equatable {
  const ProductState();

  @override
  List<Object?> get props => [];
}

class ProductInitial extends ProductState {}

class ProductLoading extends ProductState {}

class ProductsLoaded extends ProductState {
  final List<dynamic> products;
  final int total;
  final int page;
  final int totalPages;
  final bool hasMore;

  const ProductsLoaded({
    required this.products,
    required this.total,
    required this.page,
    required this.totalPages,
    required this.hasMore,
  });

  @override
  List<Object?> get props => [products, total, page, totalPages, hasMore];
}

class ProductDetailLoaded extends ProductState {
  final Map<String, dynamic> product;

  const ProductDetailLoaded({required this.product});

  @override
  List<Object?> get props => [product];
}

class CategoriesLoaded extends ProductState {
  final List<dynamic> categories;

  const CategoriesLoaded({required this.categories});

  @override
  List<Object?> get props => [categories];
}

class BrandsLoaded extends ProductState {
  final List<dynamic> brands;

  const BrandsLoaded({required this.brands});

  @override
  List<Object?> get props => [brands];
}

class ProductError extends ProductState {
  final String message;

  const ProductError({required this.message});

  @override
  List<Object?> get props => [message];
}

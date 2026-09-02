import 'package:equatable/equatable.dart';

abstract class ProductEvent extends Equatable {
  const ProductEvent();

  @override
  List<Object?> get props => [];
}

class LoadProducts extends ProductEvent {
  final String? search;
  final String? categoryId;
  final String? brandId;
  final String? sortBy;

  const LoadProducts({this.search, this.categoryId, this.brandId, this.sortBy});

  @override
  List<Object?> get props => [search, categoryId, brandId, sortBy];
}

class LoadMoreProducts extends ProductEvent {
  final String? search;
  final String? categoryId;
  final String? brandId;
  final String? sortBy;

  const LoadMoreProducts({this.search, this.categoryId, this.brandId, this.sortBy});

  @override
  List<Object?> get props => [search, categoryId, brandId, sortBy];
}

class LoadProductDetail extends ProductEvent {
  final String productId;

  const LoadProductDetail({required this.productId});

  @override
  List<Object?> get props => [productId];
}

class LoadCategories extends ProductEvent {
  const LoadCategories();
}

class LoadBrands extends ProductEvent {
  const LoadBrands();
}

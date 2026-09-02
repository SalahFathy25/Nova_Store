import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nova_core/nova_core.dart';
import 'product_event.dart';
import 'product_state.dart';

class ProductBloc extends Bloc<ProductEvent, ProductState> {
  final ProductRepository _productRepository;
  int _currentPage = 1;
  List<dynamic> _allProducts = [];

  ProductBloc({required ProductRepository productRepository})
      : _productRepository = productRepository,
        super(ProductInitial()) {
    on<LoadProducts>(_onLoadProducts);
    on<LoadMoreProducts>(_onLoadMoreProducts);
    on<LoadProductDetail>(_onLoadProductDetail);
    on<LoadCategories>(_onLoadCategories);
    on<LoadBrands>(_onLoadBrands);
  }

  Future<void> _onLoadProducts(LoadProducts event, Emitter<ProductState> emit) async {
    emit(ProductLoading());
    _currentPage = 1;
    _allProducts = [];

    final result = await _productRepository.getProducts(
      page: 1,
      search: event.search,
      categoryId: event.categoryId,
      brandId: event.brandId,
      sortBy: event.sortBy,
    );

    result.fold(
      (failure) => emit(ProductError(message: failure.message)),
      (data) {
        final products = data['data'] ?? [];
        _allProducts = List.from(products);
        emit(ProductsLoaded(
          products: _allProducts,
          total: data['total'] ?? 0,
          page: data['page'] ?? 1,
          totalPages: data['total_pages'] ?? 0,
          hasMore: (data['page'] ?? 1) < (data['total_pages'] ?? 0),
        ));
      },
    );
  }

  Future<void> _onLoadMoreProducts(LoadMoreProducts event, Emitter<ProductState> emit) async {
    if (state is ProductsLoaded && (state as ProductsLoaded).hasMore) {
      _currentPage++;
      final result = await _productRepository.getProducts(
        page: _currentPage,
        search: event.search,
        categoryId: event.categoryId,
        brandId: event.brandId,
        sortBy: event.sortBy,
      );

      result.fold(
        (failure) => emit(ProductError(message: failure.message)),
        (data) {
          final products = data['data'] ?? [];
          _allProducts.addAll(products);
          emit(ProductsLoaded(
            products: List.from(_allProducts),
            total: data['total'] ?? 0,
            page: data['page'] ?? _currentPage,
            totalPages: data['total_pages'] ?? 0,
            hasMore: _currentPage < (data['total_pages'] ?? 0),
          ));
        },
      );
    }
  }

  Future<void> _onLoadProductDetail(LoadProductDetail event, Emitter<ProductState> emit) async {
    emit(ProductLoading());
    final result = await _productRepository.getProduct(event.productId);
    result.fold(
      (failure) => emit(ProductError(message: failure.message)),
      (data) => emit(ProductDetailLoaded(product: data)),
    );
  }

  Future<void> _onLoadCategories(LoadCategories event, Emitter<ProductState> emit) async {
    emit(ProductLoading());
    final result = await _productRepository.getCategories();
    result.fold(
      (failure) => emit(ProductError(message: failure.message)),
      (data) => emit(CategoriesLoaded(categories: data)),
    );
  }

  Future<void> _onLoadBrands(LoadBrands event, Emitter<ProductState> emit) async {
    emit(ProductLoading());
    final result = await _productRepository.getBrands();
    result.fold(
      (failure) => emit(ProductError(message: failure.message)),
      (data) => emit(BrandsLoaded(brands: data)),
    );
  }
}

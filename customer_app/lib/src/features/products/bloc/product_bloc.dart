import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nova_core/nova_core.dart';
import 'product_event.dart';
import 'product_state.dart';

class ProductBloc extends Bloc<ProductEvent, ProductState> {
  final ProductRepository _productRepository;
  int _currentPage = 1;
  String? _lastSearch;
  String? _lastCategoryId;
  String? _lastBrandId;
  String? _lastSortBy;
  List<Product> _allProducts = [];

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
    _lastSearch = event.search;
    _lastCategoryId = event.categoryId;
    _lastBrandId = event.brandId;
    _lastSortBy = event.sortBy;

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
        final productsList = data['data'] ?? [];
        _allProducts = (productsList as List)
            .map((p) => Product.fromJson(p as Map<String, dynamic>))
            .toList();
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
        search: _lastSearch,
        categoryId: _lastCategoryId,
        brandId: _lastBrandId,
        sortBy: _lastSortBy,
      );

      result.fold(
        (failure) => emit(ProductError(message: failure.message)),
        (data) {
          final productsList = data['data'] ?? [];
          final newProducts = (productsList as List)
              .map((p) => Product.fromJson(p as Map<String, dynamic>))
              .toList();
          _allProducts.addAll(newProducts);
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
      (data) {
        final product = Product.fromJson(data);
        emit(ProductDetailLoaded(product: product));
      },
    );
  }

  Future<void> _onLoadCategories(LoadCategories event, Emitter<ProductState> emit) async {
    final result = await _productRepository.getCategories();
    result.fold(
      (failure) => emit(ProductError(message: failure.message)),
      (data) {
        final categories = (data as List)
            .map((c) => Category.fromJson(c as Map<String, dynamic>))
            .toList();
        emit(CategoriesLoaded(categories: categories));
      },
    );
  }

  Future<void> _onLoadBrands(LoadBrands event, Emitter<ProductState> emit) async {
    final result = await _productRepository.getBrands();
    result.fold(
      (failure) => emit(ProductError(message: failure.message)),
      (data) {
        final brands = (data as List)
            .map((b) => Brand.fromJson(b as Map<String, dynamic>))
            .toList();
        emit(BrandsLoaded(brands: brands));
      },
    );
  }
}

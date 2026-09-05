import 'dart:async';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nova_core/nova_core.dart';
import 'package:shimmer/shimmer.dart';
import '../../../core/di/injection.dart';
import '../bloc/product_bloc.dart';
import '../bloc/product_event.dart';
import '../bloc/product_state.dart';
import '../../wishlist/bloc/wishlist_bloc.dart';
import '../../wishlist/bloc/wishlist_event.dart';
import '../../wishlist/bloc/wishlist_state.dart';

class ProductListPage extends StatefulWidget {
  final String? categoryId;
  final String? categoryName;
  final String? brandId;
  final String? brandName;
  final String? searchQuery;

  const ProductListPage({
    super.key,
    this.categoryId,
    this.categoryName,
    this.brandId,
    this.brandName,
    this.searchQuery,
  });

  @override
  State<ProductListPage> createState() => _ProductListPageState();
}

class _ProductListPageState extends State<ProductListPage> {
  final ScrollController _scrollController = ScrollController();
  final List<Product> _products = [];
  bool _isLoading = false;
  bool _isLoadingMore = false;
  bool _hasMore = true;
  int _currentPage = 1;

  // Filter state
  String? _selectedCategoryId;
  RangeValues _priceRange = const RangeValues(0, 10000);
  List<String> _selectedBrandIds = [];
  List<String> _selectedSizes = [];
  List<String> _selectedColors = [];

  // Sort state
  _SortOption _sortOption = _SortOption.newest;

  // Mock data for filters
  final List<Category> _categories = [
    const Category(id: '1', tenantId: 't1', name: 'Electronics', slug: 'electronics'),
    const Category(id: '2', tenantId: 't1', name: 'Fashion', slug: 'fashion'),
    const Category(id: '3', tenantId: 't1', name: 'Home & Garden', slug: 'home-garden'),
    const Category(id: '4', tenantId: 't1', name: 'Sports', slug: 'sports'),
    const Category(id: '5', tenantId: 't1', name: 'Books', slug: 'books'),
    const Category(id: '6', tenantId: 't1', name: 'Beauty', slug: 'beauty'),
  ];

  final List<Brand> _brands = [
    const Brand(id: '1', name: 'Nike', slug: 'nike'),
    const Brand(id: '2', name: 'Adidas', slug: 'adidas'),
    const Brand(id: '3', name: 'Samsung', slug: 'samsung'),
    const Brand(id: '4', name: 'Apple', slug: 'apple'),
    const Brand(id: '5', name: 'Zara', slug: 'zara'),
  ];

  final List<String> _availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  final List<String> _availableColors = [
    'Black',
    'White',
    'Red',
    'Blue',
    'Green',
    'Yellow',
    'Pink',
    'Grey',
  ];

  @override
  void initState() {
    super.initState();
    _selectedCategoryId = widget.categoryId;
    _scrollController.addListener(_onScroll);
    _loadFilters();
    context.read<ProductBloc>().add(LoadProducts(
      categoryId: widget.categoryId,
      brandId: widget.brandId,
      search: widget.searchQuery,
    ));
  }

  void _loadFilters() async {
    final repo = getIt<ProductRepository>();
    final categoriesResult = await repo.getCategories();
    categoriesResult.fold(
      (_) {},
      (data) {
        if (data is List && mounted) {
          setState(() {
            _categories.clear();
            _categories.addAll(data.map((c) => Category.fromJson(c)).toList());
          });
        }
      },
    );
    final brandsResult = await repo.getBrands();
    brandsResult.fold(
      (_) {},
      (data) {
        if (data is List && mounted) {
          setState(() {
            _brands.clear();
            _brands.addAll(data.map((b) => Brand.fromJson(b)).toList());
          });
        }
      },
    );
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      _loadMoreProducts();
    }
  }

  Future<void> _loadProducts() async {
    if (_isLoading) return;
    setState(() {
      _isLoading = true;
      _currentPage = 1;
      _hasMore = true;
    });

    context.read<ProductBloc>().add(LoadProducts(
      categoryId: _selectedCategoryId ?? widget.categoryId,
      brandId: widget.brandId,
      search: widget.searchQuery,
    ));
  }

  Future<void> _loadMoreProducts() async {
    if (_isLoadingMore || !_hasMore || _isLoading) return;
    setState(() => _isLoadingMore = true);

    context.read<ProductBloc>().add(LoadMoreProducts(
      categoryId: _selectedCategoryId ?? widget.categoryId,
      brandId: widget.brandId,
      search: widget.searchQuery,
    ));
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isTablet = screenWidth >= 600;

    return Scaffold(
      backgroundColor: NovaTheme.backgroundColor,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          widget.categoryName ??
              widget.brandName ??
              widget.searchQuery ??
              'Products',
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: NovaTheme.textPrimary,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.tune_rounded),
            onPressed: _showFilterSheet,
          ),
          IconButton(
            icon: const Icon(Icons.swap_vert_rounded),
            onPressed: _showSortSheet,
          ),
        ],
      ),
      body: BlocBuilder<ProductBloc, ProductState>(
        builder: (context, state) {
          if (state is ProductLoading) {
            return _buildShimmerGrid(isTablet);
          }
          if (state is ProductError) {
            return _buildEmptyState();
          }
          if (state is ProductsLoaded) {
            _products.clear();
            _products.addAll(state.products);
            _hasMore = state.hasMore;
            _currentPage = state.page + 1;
            return _buildProductGrid(isTablet);
          }
          return _buildEmptyState();
        },
      ),
    );
  }

  Widget _buildShimmerGrid(bool isTablet) {
    return Shimmer.fromColors(
      baseColor: NovaTheme.borderColor,
      highlightColor: NovaTheme.surfaceColor,
      child: GridView.builder(
        padding: const EdgeInsets.all(12),
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: isTablet ? 3 : 2,
          childAspectRatio: 0.58,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
        ),
        itemCount: 6,
        itemBuilder: (context, index) {
          return Container(
            decoration: BoxDecoration(
              color: NovaTheme.surfaceColor,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  flex: 3,
                  child: Container(
                    width: double.infinity,
                    decoration: const BoxDecoration(
                      color: NovaTheme.borderColor,
                      borderRadius: BorderRadius.vertical(
                        top: Radius.circular(12),
                      ),
                    ),
                  ),
                ),
                Expanded(
                  flex: 2,
                  child: Padding(
                    padding: const EdgeInsets.all(8),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          height: 12,
                          width: double.infinity,
                          color: NovaTheme.borderColor,
                        ),
                        const SizedBox(height: 8),
                        Container(
                          height: 12,
                          width: 60,
                          color: NovaTheme.borderColor,
                        ),
                        const SizedBox(height: 8),
                        Container(
                          height: 12,
                          width: 80,
                          color: NovaTheme.borderColor,
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                color: NovaTheme.secondaryColor.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.shopping_bag_outlined,
                size: 56,
                color: NovaTheme.secondaryColor,
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'No products found',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: NovaTheme.textPrimary,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Try adjusting your filters or search criteria',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14,
                color: NovaTheme.textSecondary,
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  _selectedCategoryId = null;
                  _priceRange = const RangeValues(0, 10000);
                  _selectedBrandIds = [];
                  _selectedSizes = [];
                  _selectedColors = [];
                  _sortOption = _SortOption.newest;
                });
                _loadProducts();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: NovaTheme.secondaryColor,
                foregroundColor: NovaTheme.surfaceColor,
                padding:
                    const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: const Text('Clear Filters'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProductGrid(bool isTablet) {
    return Column(
      children: [
        _buildActiveFiltersBar(),
        Expanded(
          child: RefreshIndicator(
            color: NovaTheme.secondaryColor,
            onRefresh: _loadProducts,
            child: GridView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(12),
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: isTablet ? 3 : 2,
                childAspectRatio: 0.58,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
              ),
              itemCount: _products.length + (_hasMore ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == _products.length) {
                  return _buildLoadMoreIndicator();
                }
                return _buildProductCard(_products[index]);
              },
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildActiveFiltersBar() {
    final hasActiveFilters = _selectedCategoryId != null ||
        _priceRange != const RangeValues(0, 10000) ||
        _selectedBrandIds.isNotEmpty ||
        _selectedSizes.isNotEmpty ||
        _selectedColors.isNotEmpty;

    if (!hasActiveFilters) return const SizedBox.shrink();

    return Container(
      height: 44,
      padding: const EdgeInsets.symmetric(horizontal: 12),
      child: ListView(
        scrollDirection: Axis.horizontal,
        children: [
          if (_selectedCategoryId != null)
            _buildFilterChip(
              _categories
                  .firstWhere((c) => c.id == _selectedCategoryId)
                  .name,
              () => setState(() => _selectedCategoryId = null),
            ),
          if (_priceRange != const RangeValues(0, 10000))
            _buildFilterChip(
              'EGP ${_priceRange.start.round()} - ${_priceRange.end.round()}',
              () => setState(
                  () => _priceRange = const RangeValues(0, 10000)),
            ),
          if (_selectedBrandIds.isNotEmpty)
            ..._selectedBrandIds.map((id) {
              final brand = _brands.firstWhere((b) => b.id == id);
              return _buildFilterChip(
                brand.name,
                () => setState(() => _selectedBrandIds.remove(id)),
              );
            }),
          if (_selectedSizes.isNotEmpty)
            ..._selectedSizes.map((size) => _buildFilterChip(
                  'Size: $size',
                  () => setState(() => _selectedSizes.remove(size)),
                )),
          if (_selectedColors.isNotEmpty)
            ..._selectedColors.map((color) => _buildFilterChip(
                  color,
                  () => setState(() => _selectedColors.remove(color)),
                )),
          const SizedBox(width: 8),
          TextButton(
            onPressed: () {
              setState(() {
                _selectedCategoryId = null;
                _priceRange = const RangeValues(0, 10000);
                _selectedBrandIds.clear();
                _selectedSizes.clear();
                _selectedColors.clear();
              });
              _loadProducts();
            },
            child: const Text(
              'Clear All',
              style: TextStyle(
                color: NovaTheme.secondaryColor,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, VoidCallback onRemove) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: Chip(
        label: Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            color: NovaTheme.primaryColor,
          ),
        ),
        deleteIcon: const Icon(Icons.close, size: 16),
        onDeleted: onRemove,
        backgroundColor: NovaTheme.secondaryColor.withOpacity(0.1),
        side: BorderSide.none,
        padding: EdgeInsets.zero,
        materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
        visualDensity: VisualDensity.compact,
      ),
    );
  }

  Widget _buildLoadMoreIndicator() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: _isLoadingMore
            ? SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: NovaTheme.secondaryColor,
                ),
              )
            : const SizedBox.shrink(),
      ),
    );
  }

  Widget _buildProductCard(Product product) {
    final hasDiscount =
        product.compareAtPrice != null && product.compareAtPrice! > product.basePrice;
    final discountPercent = hasDiscount
        ? ((product.compareAtPrice! - product.basePrice) /
                product.compareAtPrice! *
                100)
            .round()
        : 0;

    return GestureDetector(
      onTap: () {
        Navigator.pushNamed(context, '/product-detail', arguments: product);
      },
      child: Container(
        decoration: BoxDecoration(
          color: NovaTheme.surfaceColor,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: NovaTheme.primaryColor.withOpacity(0.06),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              flex: 3,
              child: Stack(
                children: [
                  Container(
                    width: double.infinity,
                    decoration: const BoxDecoration(
                      borderRadius: BorderRadius.vertical(
                        top: Radius.circular(12),
                      ),
                    ),
                    child: ClipRRect(
                      borderRadius: const BorderRadius.vertical(
                        top: Radius.circular(12),
                      ),
                      child: CachedNetworkImage(
                        imageUrl: product.images.isNotEmpty
                            ? product.images.first.url
                            : '',
                        fit: BoxFit.cover,
                        placeholder: (context, url) => Container(
                          color: NovaTheme.backgroundColor,
                          child: const Center(
                            child: Icon(
                              Icons.image_outlined,
                              color: NovaTheme.textHint,
                              size: 32,
                            ),
                          ),
                        ),
                        errorWidget: (context, url, error) => Container(
                          color: NovaTheme.backgroundColor,
                          child: const Center(
                            child: Icon(
                              Icons.broken_image_outlined,
                              color: NovaTheme.textHint,
                              size: 32,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                  if (hasDiscount)
                    Positioned(
                      top: 8,
                      left: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: NovaTheme.secondaryColor,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          '-$discountPercent%',
                          style: const TextStyle(
                            color: NovaTheme.surfaceColor,
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ),
                  Positioned(
                    top: 8,
                    right: 8,
                    child: _WishlistButton(productId: product.id),
                  ),
                ],
              ),
            ),
            Expanded(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.all(8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      product.title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: NovaTheme.textPrimary,
                        height: 1.3,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          'EGP ${product.basePrice.toStringAsFixed(2)}',
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: NovaTheme.primaryColor,
                          ),
                        ),
                        if (hasDiscount) ...[
                          const SizedBox(width: 6),
                          Text(
                            'EGP ${product.compareAtPrice!.toStringAsFixed(2)}',
                            style: const TextStyle(
                              fontSize: 11,
                              color: NovaTheme.textHint,
                              decoration: TextDecoration.lineThrough,
                            ),
                          ),
                        ],
                      ],
                    ),
                    const Spacer(),
                    Row(
                      children: [
                        const Icon(
                          Icons.star_rounded,
                          size: 16,
                          color: NovaTheme.secondaryColor,
                        ),
                        const SizedBox(width: 2),
                        Text(
                          '4.${(product.basePrice % 9).round() + 1}',
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: NovaTheme.textPrimary,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          '(${(product.basePrice % 200).round() + 20})',
                          style: const TextStyle(
                            fontSize: 11,
                            color: NovaTheme.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showFilterSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _FilterBottomSheet(
        categories: _categories,
        brands: _brands,
        availableSizes: _availableSizes,
        availableColors: _availableColors,
        selectedCategoryId: _selectedCategoryId,
        priceRange: _priceRange,
        selectedBrandIds: _selectedBrandIds,
        selectedSizes: _selectedSizes,
        selectedColors: _selectedColors,
        onApply: (
          categoryId,
          priceRange,
          brandIds,
          sizes,
          colors,
        ) {
          setState(() {
            _selectedCategoryId = categoryId;
            _priceRange = priceRange;
            _selectedBrandIds = brandIds;
            _selectedSizes = sizes;
            _selectedColors = colors;
          });
          _loadProducts();
        },
      ),
    );
  }

  void _showSortSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => _SortBottomSheet(
        currentOption: _sortOption,
        onSelected: (option) {
          setState(() => _sortOption = option);
          _loadProducts();
        },
      ),
    );
  }
}

enum _SortOption {
  newest,
  priceLowToHigh,
  priceHighToLow,
  mostPopular,
}

extension _SortOptionLabel on _SortOption {
  String get label {
    switch (this) {
      case _SortOption.newest:
        return 'Newest';
      case _SortOption.priceLowToHigh:
        return 'Price: Low to High';
      case _SortOption.priceHighToLow:
        return 'Price: High to Low';
      case _SortOption.mostPopular:
        return 'Most Popular';
    }
  }

  IconData get icon {
    switch (this) {
      case _SortOption.newest:
        return Icons.access_time_rounded;
      case _SortOption.priceLowToHigh:
        return Icons.trending_down_rounded;
      case _SortOption.priceHighToLow:
        return Icons.trending_up_rounded;
      case _SortOption.mostPopular:
        return Icons.local_fire_department_rounded;
    }
  }
}

class _WishlistButton extends StatefulWidget {
  final String productId;

  const _WishlistButton({required this.productId});

  @override
  State<_WishlistButton> createState() => _WishlistButtonState();
}

class _WishlistButtonState extends State<_WishlistButton> {
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<WishlistBloc, WishlistState>(
      builder: (context, wishlistState) {
        final isWishlisted = wishlistState is WishlistLoaded &&
            wishlistState.isProductWishlisted(widget.productId);
        return GestureDetector(
          onTap: () {
            if (isWishlisted) {
              context.read<WishlistBloc>().add(
                    RemoveFromWishlist(productId: widget.productId),
                  );
            } else {
              context.read<WishlistBloc>().add(
                    AddToWishlist(productId: widget.productId),
                  );
            }
          },
          child: Container(
            width: 34,
            height: 34,
            decoration: BoxDecoration(
              color: NovaTheme.surfaceColor,
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: NovaTheme.primaryColor.withOpacity(0.12),
                  blurRadius: 6,
                ),
              ],
            ),
            child: Icon(
              isWishlisted ? Icons.favorite_rounded : Icons.favorite_border_rounded,
              size: 18,
              color: isWishlisted ? NovaTheme.secondaryColor : NovaTheme.textSecondary,
            ),
          ),
        );
      },
    );
  }
}

class _FilterBottomSheet extends StatefulWidget {
  final List<Category> categories;
  final List<Brand> brands;
  final List<String> availableSizes;
  final List<String> availableColors;
  final String? selectedCategoryId;
  final RangeValues priceRange;
  final List<String> selectedBrandIds;
  final List<String> selectedSizes;
  final List<String> selectedColors;
  final Function(String?, RangeValues, List<String>, List<String>, List<String>)
      onApply;

  const _FilterBottomSheet({
    required this.categories,
    required this.brands,
    required this.availableSizes,
    required this.availableColors,
    this.selectedCategoryId,
    required this.priceRange,
    required this.selectedBrandIds,
    required this.selectedSizes,
    required this.selectedColors,
    required this.onApply,
  });

  @override
  State<_FilterBottomSheet> createState() => _FilterBottomSheetState();
}

class _FilterBottomSheetState extends State<_FilterBottomSheet> {
  late String? _categoryId;
  late RangeValues _priceRange;
  late List<String> _brandIds;
  late List<String> _sizes;
  late List<String> _colors;

  @override
  void initState() {
    super.initState();
    _categoryId = widget.selectedCategoryId;
    _priceRange = widget.priceRange;
    _brandIds = List.from(widget.selectedBrandIds);
    _sizes = List.from(widget.selectedSizes);
    _colors = List.from(widget.selectedColors);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.75,
      decoration: const BoxDecoration(
        color: NovaTheme.surfaceColor,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        children: [
          Container(
            margin: const EdgeInsets.only(top: 12),
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: NovaTheme.borderColor,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Filters',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: NovaTheme.textPrimary,
                  ),
                ),
                TextButton(
                  onPressed: () {
                    setState(() {
                      _categoryId = null;
                      _priceRange = const RangeValues(0, 10000);
                      _brandIds.clear();
                      _sizes.clear();
                      _colors.clear();
                    });
                  },
                  child: const Text(
                    'Reset',
                    style: TextStyle(color: NovaTheme.secondaryColor),
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1, color: NovaTheme.dividerColor),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSectionTitle('Category'),
                  const SizedBox(height: 12),
                  _buildCategoryChips(),
                  const SizedBox(height: 24),
                  _buildSectionTitle('Price Range'),
                  const SizedBox(height: 12),
                  _buildPriceRangeSlider(),
                  const SizedBox(height: 24),
                  _buildSectionTitle('Brand'),
                  const SizedBox(height: 12),
                  _buildBrandSelection(),
                  const SizedBox(height: 24),
                  _buildSectionTitle('Size'),
                  const SizedBox(height: 12),
                  _buildSizeChips(),
                  const SizedBox(height: 24),
                  _buildSectionTitle('Color'),
                  const SizedBox(height: 12),
                  _buildColorChips(),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: const BoxDecoration(
              color: NovaTheme.surfaceColor,
              border: Border(top: BorderSide(color: NovaTheme.dividerColor)),
            ),
            child: SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: () {
                  widget.onApply(
                    _categoryId,
                    _priceRange,
                    _brandIds,
                    _sizes,
                    _colors,
                  );
                  Navigator.of(context).pop();
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: NovaTheme.secondaryColor,
                  foregroundColor: NovaTheme.surfaceColor,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 0,
                ),
                child: const Text(
                  'Apply Filters',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        color: NovaTheme.textPrimary,
      ),
    );
  }

  Widget _buildCategoryChips() {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: widget.categories.map((category) {
        final isSelected = _categoryId == category.id;
        return GestureDetector(
          onTap: () {
            setState(() {
              _categoryId = isSelected ? null : category.id;
            });
          },
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: BoxDecoration(
              color: isSelected
                  ? NovaTheme.secondaryColor.withOpacity(0.12)
                  : NovaTheme.backgroundColor,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: isSelected
                    ? NovaTheme.secondaryColor
                    : NovaTheme.borderColor,
              ),
            ),
            child: Text(
              category.name,
              style: TextStyle(
                fontSize: 13,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                color: isSelected
                    ? NovaTheme.secondaryColor
                    : NovaTheme.textPrimary,
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildPriceRangeSlider() {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'EGP ${_priceRange.start.round()}',
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: NovaTheme.primaryColor,
              ),
            ),
            Text(
              'EGP ${_priceRange.end.round()}',
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: NovaTheme.primaryColor,
              ),
            ),
          ],
        ),
        RangeSlider(
          values: _priceRange,
          min: 0,
          max: 10000,
          divisions: 100,
          activeColor: NovaTheme.secondaryColor,
          inactiveColor: NovaTheme.borderColor,
          labels: RangeLabels(
            'EGP ${_priceRange.start.round()}',
            'EGP ${_priceRange.end.round()}',
          ),
          onChanged: (values) {
            setState(() => _priceRange = values);
          },
        ),
      ],
    );
  }

  Widget _buildBrandSelection() {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: widget.brands.map((brand) {
        final isSelected = _brandIds.contains(brand.id);
        return GestureDetector(
          onTap: () {
            setState(() {
              if (isSelected) {
                _brandIds.remove(brand.id);
              } else {
                _brandIds.add(brand.id);
              }
            });
          },
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: BoxDecoration(
              color: isSelected
                  ? NovaTheme.secondaryColor.withOpacity(0.12)
                  : NovaTheme.backgroundColor,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: isSelected
                    ? NovaTheme.secondaryColor
                    : NovaTheme.borderColor,
              ),
            ),
            child: Text(
              brand.name,
              style: TextStyle(
                fontSize: 13,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                color: isSelected
                    ? NovaTheme.secondaryColor
                    : NovaTheme.textPrimary,
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildSizeChips() {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: widget.availableSizes.map((size) {
        final isSelected = _sizes.contains(size);
        return GestureDetector(
          onTap: () {
            setState(() {
              if (isSelected) {
                _sizes.remove(size);
              } else {
                _sizes.add(size);
              }
            });
          },
          child: Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: isSelected
                  ? NovaTheme.secondaryColor
                  : NovaTheme.backgroundColor,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: isSelected
                    ? NovaTheme.secondaryColor
                    : NovaTheme.borderColor,
              ),
            ),
            child: Center(
              child: Text(
                size,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: isSelected
                      ? NovaTheme.surfaceColor
                      : NovaTheme.textPrimary,
                ),
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildColorChips() {
    final colorMap = <String, Color>{
      'Black': Colors.black,
      'White': Colors.white,
      'Red': Colors.red,
      'Blue': Colors.blue,
      'Green': Colors.green,
      'Yellow': Colors.yellow,
      'Pink': Colors.pink,
      'Grey': Colors.grey,
    };

    return Wrap(
      spacing: 10,
      runSpacing: 10,
      children: widget.availableColors.map((colorName) {
        final isSelected = _colors.contains(colorName);
        final chipColor = colorMap[colorName] ?? Colors.grey;
        return GestureDetector(
          onTap: () {
            setState(() {
              if (isSelected) {
                _colors.remove(colorName);
              } else {
                _colors.add(colorName);
              }
            });
          },
          child: Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: chipColor,
              shape: BoxShape.circle,
              border: Border.all(
                color: isSelected
                    ? NovaTheme.secondaryColor
                    : NovaTheme.borderColor,
                width: isSelected ? 3 : 1,
              ),
              boxShadow: isSelected
                  ? [
                      BoxShadow(
                        color: NovaTheme.secondaryColor.withOpacity(0.3),
                        blurRadius: 6,
                      ),
                    ]
                  : null,
            ),
            child: isSelected
                ? const Icon(
                    Icons.check_rounded,
                    size: 18,
                    color: Colors.white,
                  )
                : null,
          ),
        );
      }).toList(),
    );
  }
}

class _SortBottomSheet extends StatelessWidget {
  final _SortOption currentOption;
  final Function(_SortOption) onSelected;

  const _SortBottomSheet({
    required this.currentOption,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: NovaTheme.surfaceColor,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            margin: const EdgeInsets.only(top: 12),
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: NovaTheme.borderColor,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const Padding(
            padding: EdgeInsets.all(20),
            child: Text(
              'Sort By',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: NovaTheme.textPrimary,
              ),
            ),
          ),
          const Divider(height: 1, color: NovaTheme.dividerColor),
          ..._SortOption.values.map((option) {
            final isSelected = currentOption == option;
            return Material(
              color: Colors.transparent,
              child: ListTile(
              leading: Icon(
                option.icon,
                color: isSelected
                    ? NovaTheme.secondaryColor
                    : NovaTheme.textSecondary,
              ),
              title: Text(
                option.label,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                  color: isSelected
                      ? NovaTheme.secondaryColor
                      : NovaTheme.textPrimary,
                ),
              ),
              trailing: isSelected
                  ? const Icon(
                      Icons.check_circle_rounded,
                      color: NovaTheme.secondaryColor,
                    )
                  : null,
              onTap: () {
                onSelected(option);
                Navigator.of(context).pop();
              },
            ),
            );
          }),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nova_core/nova_core.dart';
import '../../../core/di/injection.dart';
import '../../cart/bloc/cart_bloc.dart';
import '../../cart/bloc/cart_event.dart';
import '../../wishlist/bloc/wishlist_bloc.dart';
import '../../wishlist/bloc/wishlist_event.dart';
import '../../wishlist/bloc/wishlist_state.dart';
import '../../reviews/bloc/review_bloc.dart';
import '../../reviews/bloc/review_event.dart';
import '../../reviews/bloc/review_state.dart';
import '../../reviews/pages/review_submit_page.dart';

class ProductDetailPage extends StatefulWidget {
  final Product product;

  const ProductDetailPage({super.key, required this.product});

  @override
  State<ProductDetailPage> createState() => _ProductDetailPageState();
}

class _ProductDetailPageState extends State<ProductDetailPage> {
  late PageController _imagePageController;
  int _currentImageIndex = 0;
  int _quantity = 1;
  bool _isDescriptionExpanded = false;
  String? _selectedColor;
  String? _selectedSize;
  List<Product> _relatedProducts = [];
  bool _isLoadingRelated = true;

  @override
  void initState() {
    super.initState();
    _imagePageController = PageController();
    _initializeVariants();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ReviewBloc>().add(LoadReviews(productId: widget.product.id));
      _loadRelatedProducts();
    });
  }

  Future<void> _loadRelatedProducts() async {
    try {
      final repo = getIt<ProductRepository>();
      final result = await repo.getRelatedProducts(productId: widget.product.id, limit: 10);
      result.fold(
        (_) => setState(() => _isLoadingRelated = false),
        (data) {
          final productsData = data['products'] ?? data['data'] ?? [];
          if (productsData is List) {
            setState(() {
              _relatedProducts = productsData.map((p) => Product.fromJson(p)).toList();
              _isLoadingRelated = false;
            });
            return;
          }
          setState(() => _isLoadingRelated = false);
        },
      );
    } catch (_) {
      setState(() => _isLoadingRelated = false);
    }
  }

  void _initializeVariants() {
    if (widget.product.variants.isNotEmpty) {
      final firstVariant = widget.product.variants.first;
      if (firstVariant.attributes.containsKey('color')) {
        _selectedColor = firstVariant.attributes['color'];
      }
      if (firstVariant.attributes.containsKey('size')) {
        _selectedSize = firstVariant.attributes['size'];
      }
    }
  }

  @override
  void dispose() {
    _imagePageController.dispose();
    super.dispose();
  }

  List<String> get _availableColors {
    final colors = <String>{};
    for (final variant in widget.product.variants) {
      if (variant.attributes.containsKey('color')) {
        colors.add(variant.attributes['color']);
      }
    }
    return colors.toList();
  }

  List<String> get _availableSizes {
    final sizes = <String>{};
    for (final variant in widget.product.variants) {
      if (variant.attributes.containsKey('size')) {
        sizes.add(variant.attributes['size']);
      }
    }
    return sizes.toList();
  }

  ProductVariant? get _selectedVariant {
    if (_selectedColor == null && _selectedSize == null) return null;
    for (final variant in widget.product.variants) {
      final matchesColor =
          _selectedColor == null || variant.attributes['color'] == _selectedColor;
      final matchesSize =
          _selectedSize == null || variant.attributes['size'] == _selectedSize;
      if (matchesColor && matchesSize) return variant;
    }
    return null;
  }

  int get _stockQuantity => _selectedVariant?.stockQuantity ?? 0;

  String get _stockStatus {
    if (_stockQuantity == 0) return 'out_of_stock';
    if (_stockQuantity <= 5) return 'low_stock';
    return 'in_stock';
  }

  double get _displayPrice {
    if (_selectedVariant?.priceOverride != null) {
      return _selectedVariant!.priceOverride!;
    }
    return widget.product.basePrice;
  }

  bool get _hasDiscount =>
      widget.product.compareAtPrice != null &&
      widget.product.compareAtPrice! > _displayPrice;

  double get _discountPercent => _hasDiscount
      ? ((widget.product.compareAtPrice! - _displayPrice) /
              widget.product.compareAtPrice! * 100)
          .roundToDouble()
      : 0;

  List<String> get _imageUrls {
    if (widget.product.images.isEmpty) return [];
    return widget.product.images.map((img) => img.url).toList();
  }

  @override
  Widget build(BuildContext context) {
    final bottomPadding = MediaQuery.of(context).padding.bottom;

    return Scaffold(
      backgroundColor: NovaTheme.backgroundColor,
      body: CustomScrollView(
        slivers: [
          _buildSliverAppBar(),
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildImageGallery(),
                _buildImageIndicators(),
                const SizedBox(height: 20),
                _buildProductInfo(),
                _buildStockStatus(),
                if (_availableColors.isNotEmpty) _buildColorSelector(),
                if (_availableSizes.isNotEmpty) _buildSizeSelector(),
                _buildQuantitySelector(),
                _buildDescriptionSection(),
                _buildReviewsSummary(),
                _buildReviewsList(),
                _buildRelatedProducts(),
                SizedBox(height: bottomPadding + 100),
              ],
            ),
          ),
        ],
      ),
      bottomSheet: _buildBottomBar(bottomPadding),
    );
  }

  Widget _buildSliverAppBar() {
    return SliverAppBar(
      expandedHeight: 0,
      pinned: true,
      leading: IconButton(
        icon: Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: NovaTheme.surfaceColor.withOpacity(0.9),
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: NovaTheme.primaryColor.withOpacity(0.08),
                blurRadius: 6,
              ),
            ],
          ),
          child: const Icon(
            Icons.arrow_back_ios_new_rounded,
            size: 18,
            color: NovaTheme.textPrimary,
          ),
        ),
        onPressed: () => Navigator.of(context).pop(),
      ),
      actions: [
        BlocBuilder<WishlistBloc, WishlistState>(
          builder: (context, wishlistState) {
            final isWishlisted = wishlistState is WishlistLoaded &&
                wishlistState.isProductWishlisted(widget.product.id);
            return GestureDetector(
              onTap: () {
                if (isWishlisted) {
                  context.read<WishlistBloc>().add(
                        RemoveFromWishlist(productId: widget.product.id),
                      );
                } else {
                  context.read<WishlistBloc>().add(
                        AddToWishlist(productId: widget.product.id),
                      );
                }
              },
              child: Container(
                width: 36,
                height: 36,
                margin: const EdgeInsets.only(right: 8),
                decoration: BoxDecoration(
                  color: NovaTheme.surfaceColor.withOpacity(0.9),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: NovaTheme.primaryColor.withOpacity(0.08),
                      blurRadius: 6,
                    ),
                  ],
                ),
                child: Icon(
                  isWishlisted
                      ? Icons.favorite_rounded
                      : Icons.favorite_border_rounded,
                  size: 18,
                  color: isWishlisted
                      ? NovaTheme.secondaryColor
                      : NovaTheme.textSecondary,
                ),
              ),
            );
          },
        ),
        Container(
          width: 36,
          height: 36,
          margin: const EdgeInsets.only(right: 12),
          decoration: BoxDecoration(
            color: NovaTheme.surfaceColor.withOpacity(0.9),
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: NovaTheme.primaryColor.withOpacity(0.08),
                blurRadius: 6,
              ),
            ],
          ),
          child: const Icon(
            Icons.share_outlined,
            size: 18,
            color: NovaTheme.textSecondary,
          ),
        ),
      ],
      backgroundColor: NovaTheme.surfaceColor,
      elevation: 0,
    );
  }

  Widget _buildImageGallery() {
    if (_imageUrls.isEmpty) {
      return Container(
        height: MediaQuery.of(context).size.height * 0.45,
        width: double.infinity,
        color: NovaTheme.backgroundColor,
        child: const Center(
          child: Icon(
            Icons.image_outlined,
            size: 64,
            color: NovaTheme.textHint,
          ),
        ),
      );
    }

    return Hero(
      tag: 'product_${widget.product.id}',
      child: SizedBox(
        height: MediaQuery.of(context).size.height * 0.45,
        child: PageView.builder(
          controller: _imagePageController,
          itemCount: _imageUrls.length,
          onPageChanged: (index) {
            setState(() => _currentImageIndex = index);
          },
          itemBuilder: (context, index) {
            return InteractiveViewer(
              minScale: 0.5,
              maxScale: 3.0,
              child: CachedNetworkImage(
                imageUrl: _imageUrls[index],
                width: double.infinity,
                fit: BoxFit.contain,
                placeholder: (context, url) => Container(
                  color: NovaTheme.backgroundColor,
                  child: const Center(
                    child: CircularProgressIndicator(
                      color: NovaTheme.secondaryColor,
                      strokeWidth: 2,
                    ),
                  ),
                ),
                errorWidget: (context, url, error) => Container(
                  color: NovaTheme.backgroundColor,
                  child: const Center(
                    child: Icon(
                      Icons.broken_image_outlined,
                      size: 48,
                      color: NovaTheme.textHint,
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildImageIndicators() {
    if (_imageUrls.length <= 1) return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.only(top: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: List.generate(
          _imageUrls.length,
          (index) {
            final isActive = _currentImageIndex == index;
            return AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              margin: const EdgeInsets.symmetric(horizontal: 3),
              width: isActive ? 24 : 8,
              height: 8,
              decoration: BoxDecoration(
                color:
                    isActive ? NovaTheme.secondaryColor : NovaTheme.borderColor,
                borderRadius: BorderRadius.circular(4),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildProductInfo() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (widget.product.brandId != null)
            Padding(
              padding: const EdgeInsets.only(bottom: 6),
              child: Text(
                widget.product.brandName ?? 'Brand',
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                  color: NovaTheme.textSecondary,
                  letterSpacing: 0.5,
                ),
              ),
            ),
          Text(
            widget.product.title,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: NovaTheme.textPrimary,
              height: 1.3,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                'EGP ${_displayPrice.toStringAsFixed(2)}',
                style: const TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.w800,
                  color: NovaTheme.primaryColor,
                ),
              ),
              if (_hasDiscount) ...[
                const SizedBox(width: 10),
                Text(
                  'EGP ${widget.product.compareAtPrice!.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontSize: 16,
                    color: NovaTheme.textHint,
                    decoration: TextDecoration.lineThrough,
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: NovaTheme.secondaryColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    '-${_discountPercent.round()}%',
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: NovaTheme.secondaryColor,
                    ),
                  ),
                ),
              ],
            ],
          ),
          const SizedBox(height: 12),
          BlocBuilder<ReviewBloc, ReviewState>(
            builder: (context, reviewState) {
              final summary = reviewState is ReviewsLoaded ? reviewState.summary : null;
              final avgRating = summary?.averageRating ?? 0;
              final totalReviews = summary?.totalReviews ?? 0;
              return Row(
                children: [
                  ...List.generate(5, (index) {
                    return Icon(
                      index < avgRating.floor()
                          ? Icons.star_rounded
                          : index < avgRating
                              ? Icons.star_half_rounded
                              : Icons.star_outline_rounded,
                      size: 20,
                      color: index < avgRating
                          ? NovaTheme.secondaryColor
                          : NovaTheme.borderColor,
                    );
                  }),
                  const SizedBox(width: 6),
                  Text(
                    avgRating.toStringAsFixed(1),
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: avgRating > 0 ? NovaTheme.textPrimary : NovaTheme.textSecondary,
                    ),
                  ),
                  const SizedBox(width: 4),
                  Text(
                    '($totalReviews reviews)',
                    style: const TextStyle(
                      fontSize: 13,
                      color: NovaTheme.textSecondary,
                    ),
                  ),
                ],
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildStockStatus() {
    Color statusColor;
    String statusText;
    IconData statusIcon;

    switch (_stockStatus) {
      case 'in_stock':
        statusColor = NovaTheme.successColor;
        statusText = 'In Stock';
        statusIcon = Icons.check_circle_rounded;
        break;
      case 'low_stock':
        statusColor = NovaTheme.warningColor;
        statusText = 'Low Stock - Only $_stockQuantity left!';
        statusIcon = Icons.warning_rounded;
        break;
      case 'out_of_stock':
      default:
        statusColor = NovaTheme.errorColor;
        statusText = 'Out of Stock';
        statusIcon = Icons.cancel_rounded;
        break;
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: statusColor.withOpacity(0.08),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(statusIcon, size: 18, color: statusColor),
            const SizedBox(width: 8),
            Text(
              statusText,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: statusColor,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildColorSelector() {
    final colorMap = <String, Color>{
      'Black': Colors.black,
      'White': Colors.grey.shade200,
      'Red': Colors.red,
      'Blue': Colors.blue,
      'Green': Colors.green,
      'Yellow': Colors.yellow,
      'Pink': Colors.pink,
      'Grey': Colors.grey,
      'Nude': const Color(0xFFE3BC9A),
      'Brown': Colors.brown,
    };

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Text(
                'Color',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: NovaTheme.textPrimary,
                ),
              ),
              if (_selectedColor != null) ...[
                const SizedBox(width: 8),
                Text(
                  '- $_selectedColor',
                  style: const TextStyle(
                    fontSize: 14,
                    color: NovaTheme.textSecondary,
                  ),
                ),
              ],
            ],
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: _availableColors.map((colorName) {
              final isSelected = _selectedColor == colorName;
              final chipColor = colorMap[colorName] ?? Colors.grey;
              return GestureDetector(
                onTap: () {
                  setState(() => _selectedColor = colorName);
                },
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: chipColor,
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: isSelected
                          ? NovaTheme.secondaryColor
                          : NovaTheme.borderColor,
                      width: isSelected ? 3 : 1.5,
                    ),
                    boxShadow: isSelected
                        ? [
                            BoxShadow(
                              color:
                                  NovaTheme.secondaryColor.withOpacity(0.3),
                              blurRadius: 8,
                            ),
                          ]
                        : null,
                  ),
                  child: isSelected
                      ? const Icon(
                          Icons.check_rounded,
                          size: 20,
                          color: Colors.white,
                        )
                      : null,
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildSizeSelector() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Text(
                'Size',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: NovaTheme.textPrimary,
                ),
              ),
              if (_selectedSize != null) ...[
                const SizedBox(width: 8),
                Text(
                  '- $_selectedSize',
                  style: const TextStyle(
                    fontSize: 14,
                    color: NovaTheme.textSecondary,
                  ),
                ),
              ],
            ],
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: _availableSizes.map((size) {
              final isSelected = _selectedSize == size;
              return GestureDetector(
                onTap: () {
                  setState(() => _selectedSize = size);
                },
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  width: 52,
                  height: 52,
                  decoration: BoxDecoration(
                    color: isSelected
                        ? NovaTheme.secondaryColor
                        : NovaTheme.surfaceColor,
                    borderRadius: BorderRadius.circular(10),
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
                        fontSize: 14,
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
          ),
        ],
      ),
    );
  }

  Widget _buildQuantitySelector() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Quantity',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: NovaTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Container(
                decoration: BoxDecoration(
                  color: _quantity > 1
                      ? NovaTheme.backgroundColor
                      : NovaTheme.surfaceColor,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: NovaTheme.borderColor),
                ),
                child: IconButton(
                  onPressed:
                      _quantity > 1 ? () => setState(() => _quantity--) : null,
                  icon: Icon(
                    Icons.remove_rounded,
                    size: 20,
                    color: _quantity > 1
                        ? NovaTheme.textPrimary
                        : NovaTheme.textHint,
                  ),
                ),
              ),
              Container(
                width: 56,
                height: 44,
                alignment: Alignment.center,
                child: Text(
                  '$_quantity',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: NovaTheme.textPrimary,
                  ),
                ),
              ),
              Container(
                decoration: BoxDecoration(
                  color: NovaTheme.secondaryColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: NovaTheme.secondaryColor.withOpacity(0.3),
                  ),
                ),
                child: IconButton(
                  onPressed: _quantity < _stockQuantity
                      ? () => setState(() => _quantity++)
                      : null,
                  icon: const Icon(
                    Icons.add_rounded,
                    size: 20,
                    color: NovaTheme.secondaryColor,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildDescriptionSection() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          GestureDetector(
            onTap: () {
              setState(
                  () => _isDescriptionExpanded = !_isDescriptionExpanded);
            },
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Description',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: NovaTheme.textPrimary,
                  ),
                ),
                AnimatedRotation(
                  turns: _isDescriptionExpanded ? 0.5 : 0,
                  duration: const Duration(milliseconds: 300),
                  child: const Icon(
                    Icons.keyboard_arrow_down_rounded,
                    color: NovaTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          AnimatedCrossFade(
            firstChild: Text(
              widget.product.description ??
                  'No description available for this product.',
              maxLines: 3,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 14,
                height: 1.6,
                color: NovaTheme.textSecondary,
              ),
            ),
            secondChild: Text(
              widget.product.description ??
                  'No description available for this product.',
              style: const TextStyle(
                fontSize: 14,
                height: 1.6,
                color: NovaTheme.textSecondary,
              ),
            ),
            crossFadeState: _isDescriptionExpanded
                ? CrossFadeState.showSecond
                : CrossFadeState.showFirst,
            duration: const Duration(milliseconds: 300),
          ),
          const SizedBox(height: 12),
          if (widget.product.tags.isNotEmpty)
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: widget.product.tags.map((tag) {
                return Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: NovaTheme.secondaryColor.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    tag,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: NovaTheme.secondaryColor,
                    ),
                  ),
                );
              }).toList(),
            ),
        ],
      ),
    );
  }

  Widget _buildReviewsSummary() {
    return BlocBuilder<ReviewBloc, ReviewState>(
      builder: (context, state) {
        final summary = state is ReviewsLoaded ? state.summary : null;
        final avgRating = summary?.averageRating ?? 0;
        final totalReviews = summary?.totalReviews ?? 0;
        final distribution = summary?.ratingDistribution ?? {};

        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Reviews',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: NovaTheme.textPrimary,
                    ),
                  ),
                  Row(
                    children: [
                      TextButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => BlocProvider.value(
                                value: context.read<ReviewBloc>(),
                                child: ReviewSubmitPage(
                                  productId: widget.product.id,
                                  productName: widget.product.title,
                                ),
                              ),
                            ),
                          ).then((_) {
                            context.read<ReviewBloc>().add(LoadReviews(productId: widget.product.id));
                          });
                        },
                        child: const Text(
                          'Write a Review',
                          style: TextStyle(color: NovaTheme.secondaryColor),
                        ),
                      ),
                      if (totalReviews > 5)
                        TextButton(
                          onPressed: () {
                            Navigator.pushNamed(
                              context,
                              '/reviews',
                              arguments: {
                                'productId': widget.product.id,
                                'productName': widget.product.title,
                              },
                            );
                          },
                          child: const Text(
                            'View All',
                            style: TextStyle(color: NovaTheme.secondaryColor),
                          ),
                        ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: NovaTheme.surfaceColor,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: NovaTheme.dividerColor),
                ),
                child: Row(
                  children: [
                    Column(
                      children: [
                        Text(
                          avgRating.toStringAsFixed(1),
                          style: TextStyle(
                            fontSize: 36,
                            fontWeight: FontWeight.w800,
                            color: avgRating > 0 ? NovaTheme.textPrimary : NovaTheme.textSecondary,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: List.generate(
                            5,
                            (index) => Icon(
                              index < avgRating.floor()
                                  ? Icons.star_rounded
                                  : index < avgRating
                                      ? Icons.star_half_rounded
                                      : Icons.star_outline_rounded,
                              size: 16,
                              color: index < avgRating
                                  ? NovaTheme.secondaryColor
                                  : NovaTheme.borderColor,
                            ),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '$totalReviews reviews',
                          style: const TextStyle(
                            fontSize: 12,
                            color: NovaTheme.textSecondary,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(width: 24),
                    Expanded(
                      child: Column(
                        children: List.generate(5, (index) {
                          final starCount = 5 - index;
                          final count = distribution[starCount] ?? 0;
                          final percent = totalReviews > 0 ? count / totalReviews : 0.0;
                          return Padding(
                            padding: const EdgeInsets.symmetric(vertical: 2),
                            child: Row(
                              children: [
                                Text(
                                  '$starCount',
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: NovaTheme.textSecondary,
                                  ),
                                ),
                                const SizedBox(width: 6),
                                const Icon(
                                  Icons.star_rounded,
                                  size: 12,
                                  color: NovaTheme.secondaryColor,
                                ),
                                const SizedBox(width: 6),
                                Expanded(
                                  child: ClipRRect(
                                    borderRadius: BorderRadius.circular(2),
                                    child: LinearProgressIndicator(
                                      value: percent,
                                      minHeight: 6,
                                      backgroundColor: NovaTheme.borderColor,
                                      valueColor: const AlwaysStoppedAnimation<Color>(
                                        NovaTheme.secondaryColor,
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          );
                        }),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildReviewsList() {
    return BlocBuilder<ReviewBloc, ReviewState>(
      builder: (context, state) {
        if (state is ReviewLoading) {
          return const Padding(
            padding: EdgeInsets.all(20),
            child: Center(
              child: CircularProgressIndicator(color: NovaTheme.secondaryColor),
            ),
          );
        }

        if (state is ReviewsLoaded) {
          if (state.reviews.isEmpty) {
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: NovaTheme.surfaceColor,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: NovaTheme.dividerColor),
                ),
                child: const Center(
                  child: Column(
                    children: [
                      Icon(Icons.reviews_outlined, size: 40, color: NovaTheme.textHint),
                      SizedBox(height: 8),
                      Text(
                        'No reviews yet',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: NovaTheme.textSecondary,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        'Be the first to review this product',
                        style: TextStyle(
                          fontSize: 12,
                          color: NovaTheme.textHint,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          }

          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              children: state.reviews.take(5).map((review) {
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: NovaTheme.surfaceColor,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: NovaTheme.dividerColor),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 32,
                            height: 32,
                            decoration: BoxDecoration(
                              color: NovaTheme.secondaryColor.withOpacity(0.12),
                              shape: BoxShape.circle,
                            ),
                            child: Center(
                              child: Text(
                                (review.userName ?? 'U')[0].toUpperCase(),
                                style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w700,
                                  color: NovaTheme.secondaryColor,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  review.userName ?? 'Anonymous',
                                  style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                    color: NovaTheme.textPrimary,
                                  ),
                                ),
                                Text(
                                  review.createdAt != null
                                      ? '${review.createdAt!.day}/${review.createdAt!.month}/${review.createdAt!.year}'
                                      : '',
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: NovaTheme.textSecondary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Row(
                            children: List.generate(
                              review.rating,
                              (index) => const Icon(
                                Icons.star_rounded,
                                size: 14,
                                color: NovaTheme.secondaryColor,
                              ),
                            ),
                          ),
                        ],
                      ),
                      if (review.title != null && review.title!.isNotEmpty) ...[
                        const SizedBox(height: 10),
                        Text(
                          review.title!,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: NovaTheme.textPrimary,
                          ),
                        ),
                      ],
                      if (review.comment != null && review.comment!.isNotEmpty) ...[
                        const SizedBox(height: 6),
                        Text(
                          review.comment!,
                          style: const TextStyle(
                            fontSize: 13,
                            height: 1.5,
                            color: NovaTheme.textSecondary,
                          ),
                        ),
                      ],
                      if (review.isVerifiedPurchase) ...[
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: NovaTheme.successColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text(
                            'Verified Purchase',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: NovaTheme.successColor,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                );
              }).toList(),
            ),
          );
        }

        return const SizedBox.shrink();
      },
    );
  }

  Widget _buildRelatedProducts() {
    if (_isLoadingRelated) {
      return const Padding(
        padding: EdgeInsets.only(top: 16),
        child: Center(child: CircularProgressIndicator(color: NovaTheme.secondaryColor)),
      );
    }
    if (_relatedProducts.isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.only(top: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 20),
            child: Text(
              'You May Also Like',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: NovaTheme.textPrimary,
              ),
            ),
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 200,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _relatedProducts.length,
              itemBuilder: (context, index) {
                final product = _relatedProducts[index];
                return GestureDetector(
                  onTap: () => Navigator.pushReplacementNamed(
                    context,
                    '/product-detail',
                    arguments: product,
                  ),
                  child: Container(
                    width: 140,
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    decoration: BoxDecoration(
                      color: NovaTheme.surfaceColor,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: NovaTheme.dividerColor),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: ClipRRect(
                            borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                            child: CachedNetworkImage(
                              imageUrl: product.images.isNotEmpty ? product.images.first.url : '',
                              fit: BoxFit.cover,
                              width: double.infinity,
                              errorWidget: (context, url, error) => Container(
                                color: NovaTheme.grey100,
                                child: const Icon(Icons.image_outlined, color: NovaTheme.textHint),
                              ),
                            ),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(8),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                product.title,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'EGP ${product.basePrice.toStringAsFixed(2)}',
                                style: const TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w700,
                                  color: NovaTheme.primaryColor,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomBar(double bottomPadding) {
    return Container(
      padding: EdgeInsets.fromLTRB(20, 12, 20, bottomPadding + 12),
      decoration: const BoxDecoration(
        color: NovaTheme.surfaceColor,
        border: Border(top: BorderSide(color: NovaTheme.dividerColor)),
        boxShadow: [
          BoxShadow(
            color: Color(0x0A000000),
            blurRadius: 10,
            offset: Offset(0, -2),
          ),
        ],
      ),
      child: Row(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Total Price',
                style: TextStyle(
                  fontSize: 12,
                  color: NovaTheme.textSecondary,
                ),
              ),
              Text(
                'EGP ${(_displayPrice * _quantity).toStringAsFixed(2)}',
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  color: NovaTheme.primaryColor,
                ),
              ),
            ],
          ),
          const SizedBox(width: 16),
          Expanded(
            child: SizedBox(
              height: 50,
              child: ElevatedButton(
                onPressed: _stockStatus != 'out_of_stock'
                    ? () {
                        context.read<CartBloc>().add(
                              AddToCart(
                                productId: widget.product.id,
                                variantId: _selectedVariant?.id,
                                quantity: _quantity,
                              ),
                            );
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(
                              'Added $_quantity item(s) to cart',
                            ),
                            behavior: SnackBarBehavior.floating,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                            backgroundColor: NovaTheme.successColor,
                          ),
                        );
                      }
                    : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: NovaTheme.secondaryColor,
                  foregroundColor: NovaTheme.surfaceColor,
                  disabledBackgroundColor: NovaTheme.borderColor,
                  disabledForegroundColor: NovaTheme.textHint,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 0,
                ),
                child: const Text(
                  'Add to Cart',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(width: 10),
            SizedBox(
              height: 50,
              width: 50,
              child: ElevatedButton(
                onPressed: _stockStatus != 'out_of_stock'
                    ? () {
                        context.read<CartBloc>().add(
                              AddToCart(
                                productId: widget.product.id,
                                variantId: _selectedVariant?.id,
                                quantity: _quantity,
                              ),
                            );
                        Navigator.pushNamed(context, '/cart');
                      }
                    : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: NovaTheme.primaryColor,
                foregroundColor: NovaTheme.surfaceColor,
                disabledBackgroundColor: NovaTheme.borderColor,
                disabledForegroundColor: NovaTheme.textHint,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                padding: EdgeInsets.zero,
                elevation: 0,
              ),
              child: const Icon(Icons.flash_on_rounded, size: 22),
            ),
          ),
        ],
      ),
    );
  }
}
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:shimmer/shimmer.dart';
import 'package:nova_core/nova_core.dart';
import '../../products/bloc/product_bloc.dart';
import '../../products/bloc/product_event.dart';
import '../../products/bloc/product_state.dart';

class CategoryPage extends StatefulWidget {
  const CategoryPage({super.key});

  @override
  State<CategoryPage> createState() => _CategoryPageState();
}

class _CategoryPageState extends State<CategoryPage> {
  List<Category> _parentCategories = [];
  Category? _selectedCategory;
  List<Product> _products = [];

  @override
  void initState() {
    super.initState();
    context.read<ProductBloc>().add(const LoadCategories());
  }

  void _loadProductsForCategory(Category category) {
    context.read<ProductBloc>().add(LoadProducts(categoryId: category.id));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: NovaTheme.backgroundColor,
      appBar: AppBar(
        title: const Text('الأقسام'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search_rounded),
            onPressed: () {},
          ),
        ],
      ),
      body: SafeArea(
        child: BlocBuilder<ProductBloc, ProductState>(
          builder: (context, state) {
            if (state is ProductLoading) {
              return _buildLoadingBody();
            }
            if (state is CategoriesLoaded) {
              _parentCategories = state.categories;
              if (_parentCategories.isNotEmpty && _selectedCategory == null) {
                _selectedCategory = _parentCategories.first;
                _loadProductsForCategory(_selectedCategory!);
              }
              return _buildContentBody();
            }
            if (state is ProductsLoaded) {
              _products = state.products;
              return _buildContentBody();
            }
            return _buildErrorBody();
          },
        ),
      ),
    );
  }

  Widget _buildLoadingBody() {
    return Row(
      children: [
        // Left panel - categories shimmer
        Container(
          width: (MediaQuery.of(context).size.width * 0.12).clamp(100.0, 160.0),
          color: NovaTheme.surfaceColor,
          child: Shimmer.fromColors(
            baseColor: NovaTheme.grey200,
            highlightColor: NovaTheme.grey100,
            child: ListView.builder(
              physics: const NeverScrollableScrollPhysics(),
              itemCount: 8,
              itemBuilder: (context, index) {
              return Container(
                height: 72,
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                        decoration: BoxDecoration(
                          color: NovaTheme.grey200,
                          shape: BoxShape.circle,
                        ),
                      ),
                    const SizedBox(height: 4),
                    Container(
                      width: 56,
                      height: 8,
                        decoration: BoxDecoration(
                          color: NovaTheme.grey200,
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ),
        VerticalDivider(width: 1, color: NovaTheme.grey200),
        // Right panel - products shimmer
        Expanded(
          child: Padding(
            padding: const EdgeInsets.all(NovaTheme.spacingSm),
            child: Shimmer.fromColors(
              baseColor: NovaTheme.grey200,
              highlightColor: NovaTheme.grey100,
              child: GridView.builder(
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.68,
                  crossAxisSpacing: NovaTheme.spacingSm,
                  mainAxisSpacing: NovaTheme.spacingSm,
                ),
                itemCount: 6,
                itemBuilder: (context, index) {
                  return Container(
                    decoration: BoxDecoration(
                      color: NovaTheme.grey200,
                      borderRadius: BorderRadius.circular(NovaTheme.radiusMd),
                    ),
                  );
                },
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildErrorBody() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(NovaTheme.spacingXl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline_rounded, size: 64, color: NovaTheme.grey400),
            const SizedBox(height: NovaTheme.spacingMd),
            Text(
              'حدث خطأ ما',
              style: NovaTheme.headingSmall,
            ),
            const SizedBox(height: NovaTheme.spacingSm),
            Text(
              'تحقق من اتصالك بالإنترنت وحاول مرة أخرى',
              style: NovaTheme.bodyMedium.copyWith(color: NovaTheme.textSecondary),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: NovaTheme.spacingLg),
            ElevatedButton.icon(
              onPressed: () => context.read<ProductBloc>().add(const LoadCategories()),
              icon: const Icon(Icons.refresh),
              label: const Text('إعادة المحاولة'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildContentBody() {
    return Row(
      children: [
        // Left panel - parent categories
        Container(
          width: (MediaQuery.of(context).size.width * 0.12).clamp(100.0, 160.0),
          color: NovaTheme.surfaceColor,
          child: _buildParentCategoryList(),
        ),
        VerticalDivider(width: 1, color: NovaTheme.grey200),
        // Right panel - subcategories and products
        Expanded(
          child: _selectedCategory != null
              ? _buildCategoryContent(_selectedCategory!)
              : _buildEmptyState(),
        ),
      ],
    );
  }

  Widget _buildParentCategoryList() {
    return ListView.builder(
      padding: EdgeInsets.zero,
      itemCount: _parentCategories.length,
      itemBuilder: (context, index) {
        final category = _parentCategories[index];
        final isSelected = _selectedCategory?.id == category.id;

        return GestureDetector(
          onTap: () {
            setState(() {
              _selectedCategory = category;
              _loadProductsForCategory(category);
            });
          },
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            height: 72,
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
            decoration: BoxDecoration(
              color: isSelected ? NovaTheme.backgroundColor : NovaTheme.surfaceColor,
              border: Border(
                left: BorderSide(
                  color: isSelected ? NovaTheme.secondaryColor : Colors.transparent,
                  width: 3,
                ),
              ),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: isSelected ? NovaTheme.secondaryColor.withOpacity(0.1) : NovaTheme.grey100,
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: isSelected ? NovaTheme.secondaryColor : NovaTheme.grey200,
                      width: isSelected ? 2 : 1,
                    ),
                  ),
                  child: category.imageUrl != null
                      ? ClipOval(
                          child: CachedNetworkImage(
                            imageUrl: category.imageUrl!,
                            fit: BoxFit.cover,
                            placeholder: (context, url) => Shimmer.fromColors(
                              baseColor: NovaTheme.grey200,
                              highlightColor: NovaTheme.grey100,
                              child: Container(color: NovaTheme.grey200),
                            ),
                            errorWidget: (context, url, error) => Icon(
                              Icons.category_outlined,
                              color: isSelected ? NovaTheme.secondaryColor : NovaTheme.grey500,
                              size: 22,
                            ),
                          ),
                        )
                      : Icon(
                          Icons.category_outlined,
                          color: isSelected ? NovaTheme.secondaryColor : NovaTheme.grey500,
                          size: 22,
                        ),
                ),
                const SizedBox(height: 6),
                Text(
                  category.name,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                    color: isSelected ? NovaTheme.textPrimary : NovaTheme.textSecondary,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildCategoryContent(Category category) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Subcategories horizontal scroll
        if (category.children.isNotEmpty)
          Container(
            height: 90,
            color: NovaTheme.surfaceColor,
            padding: const EdgeInsets.symmetric(vertical: NovaTheme.spacingSm),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: NovaTheme.spacingSm),
              itemCount: category.children.length,
              itemBuilder: (context, index) {
                final sub = category.children[index];
                return _buildSubcategoryChip(sub);
              },
            ),
          ),
        // Products grid header
        Padding(
          padding: const EdgeInsets.fromLTRB(
            NovaTheme.spacingMd,
            NovaTheme.spacingSm,
            NovaTheme.spacingMd,
            0,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'منتجات ${category.name}',
                style: NovaTheme.labelLarge,
              ),
              Text(
                '${_products.length} منتج',
                style: NovaTheme.bodySmall,
              ),
            ],
          ),
        ),
        const SizedBox(height: NovaTheme.spacingSm),
        // Products grid
        Expanded(
          child: _products.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.inventory_2_outlined, size: 56, color: NovaTheme.grey400),
                      const SizedBox(height: NovaTheme.spacingMd),
                      Text(
                        'لا توجد منتجات في هذا القسم',
                        style: NovaTheme.bodyMedium.copyWith(color: NovaTheme.textSecondary),
                      ),
                    ],
                  ),
                )
              : GridView.builder(
                  padding: const EdgeInsets.symmetric(
                    horizontal: NovaTheme.spacingSm,
                    vertical: NovaTheme.spacingSm,
                  ),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 0.68,
                    crossAxisSpacing: NovaTheme.spacingSm,
                    mainAxisSpacing: NovaTheme.spacingSm,
                  ),
                  itemCount: _products.length,
                  itemBuilder: (context, index) {
                    final product = _products[index];
                    return _buildProductCard(product);
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildSubcategoryChip(Category subcategory) {
    return GestureDetector(
      onTap: () {
        // Navigate to subcategory products
      },
      child: Container(
        width: 80,
        margin: const EdgeInsets.symmetric(horizontal: NovaTheme.spacingXs),
        child: Column(
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: NovaTheme.grey100,
                shape: BoxShape.circle,
                border: Border.all(color: NovaTheme.grey200),
              ),
              child: const Icon(
                Icons.grid_view_rounded,
                color: NovaTheme.grey600,
                size: 24,
              ),
            ),
            const SizedBox(height: NovaTheme.spacingXs),
            Text(
              subcategory.name,
              style: NovaTheme.bodySmall.copyWith(
                color: NovaTheme.textPrimary,
                fontSize: 10,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.category_outlined, size: 64, color: NovaTheme.grey400),
          const SizedBox(height: NovaTheme.spacingMd),
          Text(
            'اختر قسم من القائمة',
            style: NovaTheme.bodyLarge.copyWith(color: NovaTheme.textSecondary),
          ),
        ],
      ),
    );
  }

  Widget _buildProductCard(Product product) {
    final discountPercent = product.compareAtPrice != null && product.compareAtPrice! > product.basePrice
        ? ((product.compareAtPrice! - product.basePrice) / product.compareAtPrice! * 100).round()
        : 0;

    return Card(
      elevation: NovaTheme.elevationSm,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(NovaTheme.radiusMd),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 5,
            child: Stack(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(NovaTheme.radiusMd),
                  ),
                  child: SizedBox(
                    width: double.infinity,
                    height: double.infinity,
                    child: product.images.isNotEmpty
                        ? CachedNetworkImage(
                            imageUrl: product.images.first.url,
                            fit: BoxFit.cover,
                            placeholder: (context, url) => Shimmer.fromColors(
                              baseColor: NovaTheme.grey200,
                              highlightColor: NovaTheme.grey100,
                              child: Container(color: NovaTheme.grey200),
                            ),
                            errorWidget: (context, url, error) => Container(
                              color: NovaTheme.grey100,
                              child: const Icon(Icons.image_not_supported_outlined, color: NovaTheme.grey400),
                            ),
                          )
                        : Container(
                            color: NovaTheme.grey100,
                            child: const Icon(Icons.image_outlined, color: NovaTheme.grey400, size: 40),
                          ),
                  ),
                ),
                if (discountPercent > 0)
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: NovaTheme.errorColor,
                        borderRadius: BorderRadius.circular(NovaTheme.radiusFull),
                      ),
                      child: Text(
                        '-$discountPercent%',
                        style: const TextStyle(
                          color: NovaTheme.textOnPrimary,
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                Positioned(
                  top: 8,
                  left: 8,
                  child: GestureDetector(
                    onTap: () {},
                    child: Container(
                      width: 32,
                      height: 32,
                      decoration: BoxDecoration(
                        color: NovaTheme.surfaceColor,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: NovaTheme.primaryColor.withOpacity(0.1),
                            blurRadius: 4,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.favorite_border_rounded,
                        size: 18,
                        color: NovaTheme.grey500,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            flex: 4,
            child: Padding(
              padding: const EdgeInsets.all(NovaTheme.spacingSm),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    product.title,
                    style: NovaTheme.bodySmall.copyWith(
                      color: NovaTheme.textPrimary,
                      fontWeight: FontWeight.w500,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '${product.basePrice.toStringAsFixed(0)} ج.م',
                        style: NovaTheme.priceSmall.copyWith(fontSize: 13),
                      ),
                      if (product.compareAtPrice != null && product.compareAtPrice! > product.basePrice)
                        Text(
                          '${product.compareAtPrice!.toStringAsFixed(0)} ج.م',
                          style: NovaTheme.discountPrice.copyWith(fontSize: 11),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

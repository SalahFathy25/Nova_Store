import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:shimmer/shimmer.dart';
import 'package:nova_core/nova_core.dart';
import '../bloc/home_bloc.dart';
import '../bloc/home_event.dart';
import '../bloc/home_state.dart';
import '../../../core/router/app_router.dart';
import '../../../core/utils/responsive_layout.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final PageController _bannerController = PageController();
  int _currentBannerIndex = 0;
  Timer? _bannerTimer;
  bool _bannerStarted = false;

  @override
  void dispose() {
    _bannerController.dispose();
    _bannerTimer?.cancel();
    super.dispose();
  }

  void _startBannerAutoScroll(int bannerCount) {
    if (_bannerStarted || bannerCount == 0) return;
    _bannerStarted = true;
    _bannerTimer = Timer.periodic(const Duration(seconds: 4), (timer) {
      if (_bannerController.hasClients) {
        final nextPage = (_currentBannerIndex + 1) % bannerCount;
        _bannerController.animateToPage(
          nextPage,
          duration: const Duration(milliseconds: 350),
          curve: Curves.easeInOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: NovaTheme.backgroundColor,
      appBar: _buildAppBar(),
      body: SafeArea(
        top: false,
        child: BlocBuilder<HomeBloc, HomeState>(
          builder: (context, state) {
            if (state is HomeLoading) return _buildLoadingBody();
            if (state is HomeError) return _buildErrorBody(state.message);
            if (state is HomeLoaded) return _buildContentBody(state);
            return const SizedBox.shrink();
          },
        ),
      ),
    );
  }

  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      backgroundColor: NovaTheme.surfaceColor,
      elevation: 0,
      title: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: NovaTheme.primaryColor,
              borderRadius: BorderRadius.circular(NovaTheme.radiusSm),
            ),
            child: const Center(
              child: Text(
                'N',
                style: TextStyle(
                  color: NovaTheme.textOnPrimary,
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
            ),
          ),
          const SizedBox(width: 8),
          const Text(
            'NOVA',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: NovaTheme.primaryColor,
              letterSpacing: 1.5,
            ),
          ),
        ],
      ),
      centerTitle: true,
      actions: [
        IconButton(
          icon: const Icon(Icons.search_rounded, size: 26),
          onPressed: () => Navigator.pushNamed(context, AppRouter.search),
        ),
        Stack(
          children: [
            IconButton(
              icon: const Icon(Icons.notifications_outlined, size: 26),
              onPressed: () => Navigator.pushNamed(context, AppRouter.notifications),
            ),
          ],
        ),
        const SizedBox(width: 4),
      ],
    );
  }

  Widget _buildLoadingBody() {
    return SingleChildScrollView(
      physics: const NeverScrollableScrollPhysics(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildBannerShimmer(),
          const SizedBox(height: NovaTheme.spacingLg),
          _buildSectionHeaderShimmer(),
          const SizedBox(height: NovaTheme.spacingSm),
          _buildCategoriesShimmer(),
          const SizedBox(height: NovaTheme.spacingLg),
          _buildSectionHeaderShimmer(),
          const SizedBox(height: NovaTheme.spacingSm),
          _buildFlashSaleShimmer(),
          const SizedBox(height: NovaTheme.spacingLg),
          _buildSectionHeaderShimmer(),
          const SizedBox(height: NovaTheme.spacingSm),
          _buildProductGridShimmer(),
        ],
      ),
    );
  }

  Widget _buildBannerShimmer() {
    return Shimmer.fromColors(
      baseColor: NovaTheme.grey200,
      highlightColor: NovaTheme.grey100,
      child: Container(
        height: 200,
        margin: const EdgeInsets.symmetric(horizontal: NovaTheme.spacingMd),
        decoration: BoxDecoration(
          color: NovaTheme.grey200,
          borderRadius: BorderRadius.circular(NovaTheme.radiusLg),
        ),
      ),
    );
  }

  Widget _buildSectionHeaderShimmer() {
    return Shimmer.fromColors(
      baseColor: NovaTheme.grey200,
      highlightColor: NovaTheme.grey100,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: NovaTheme.spacingMd),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              width: 140,
              height: 22,
              decoration: BoxDecoration(
                color: NovaTheme.grey200,
                borderRadius: BorderRadius.circular(4),
              ),
            ),
            Container(
              width: 60,
              height: 16,
              decoration: BoxDecoration(
                color: NovaTheme.grey200,
                borderRadius: BorderRadius.circular(4),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoriesShimmer() {
    return SizedBox(
      height: 100,
      child: Shimmer.fromColors(
        baseColor: NovaTheme.grey200,
        highlightColor: NovaTheme.grey100,
        child: ListView.builder(
          scrollDirection: Axis.horizontal,
          physics: const NeverScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: NovaTheme.spacingMd),
          itemCount: 6,
          itemBuilder: (context, index) {
            return Container(
              width: 80,
              margin: const EdgeInsets.only(right: NovaTheme.spacingMd),
              child: Column(
                children: [
                  Container(
                    width: 64,
                    height: 64,
                    decoration: const BoxDecoration(
                      color: NovaTheme.grey200,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(height: NovaTheme.spacingSm),
                  Container(
                    width: 60,
                    height: 12,
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
    );
  }

  Widget _buildFlashSaleShimmer() {
    return SizedBox(
      height: 200,
      child: Shimmer.fromColors(
        baseColor: NovaTheme.grey200,
        highlightColor: NovaTheme.grey100,
        child: ListView.builder(
          scrollDirection: Axis.horizontal,
          physics: const NeverScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: NovaTheme.spacingMd),
          itemCount: 4,
          itemBuilder: (context, index) {
            return Container(
              width: 140,
              margin: const EdgeInsets.only(right: NovaTheme.spacingMd),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    height: 120,
                    decoration: BoxDecoration(
                      color: NovaTheme.grey200,
                      borderRadius: BorderRadius.circular(NovaTheme.radiusMd),
                    ),
                  ),
                  const SizedBox(height: NovaTheme.spacingSm),
                  Container(
                    width: 100,
                    height: 14,
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
    );
  }

  Widget _buildProductGridShimmer() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: NovaTheme.spacingMd),
      child: Shimmer.fromColors(
        baseColor: NovaTheme.grey200,
        highlightColor: NovaTheme.grey100,
        child: GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: ResponsiveLayout.gridCrossAxisCount(context),
            childAspectRatio: 0.68,
            crossAxisSpacing: NovaTheme.spacingSm,
            mainAxisSpacing: NovaTheme.spacingSm,
          ),
          itemCount: 4,
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
    );
  }

  Widget _buildErrorBody(String message) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(NovaTheme.spacingXl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline_rounded, size: 64, color: NovaTheme.grey400),
            const SizedBox(height: NovaTheme.spacingMd),
            Text(message, style: NovaTheme.bodyMedium.copyWith(color: NovaTheme.textSecondary), textAlign: TextAlign.center),
            const SizedBox(height: NovaTheme.spacingLg),
            ElevatedButton.icon(
              onPressed: () => context.read<HomeBloc>().add(const LoadHome()),
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildContentBody(HomeLoaded state) {
    _startBannerAutoScroll(state.banners.length);
    return RefreshIndicator(
      onRefresh: () async => context.read<HomeBloc>().add(const RefreshHome()),
      color: NovaTheme.primaryColor,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildBannerSection(state.banners),
            const SizedBox(height: NovaTheme.spacingLg),
            ...state.sections.map((section) {
              final type = section['type'] ?? '';
              final data = section['data'];
              switch (type) {
                case 'category_grid':
                  return _buildCategoriesFromList(data);
                case 'flash_sale':
                  return _buildFlashSaleFromSection(data);
                case 'product_list':
                case 'product_grid':
                  return _buildBestSellersFromList(data);
                default:
                  return const SizedBox.shrink();
              }
            }),
            const SizedBox(height: NovaTheme.spacingXxl),
          ],
        ),
      ),
    );
  }

  Widget _buildBannerSection(List<dynamic> banners) {
    if (banners.isEmpty) return const SizedBox.shrink();

    return Column(
      children: [
        SizedBox(
          height: 200,
          child: PageView.builder(
            controller: _bannerController,
            itemCount: banners.length,
            onPageChanged: (index) => setState(() => _currentBannerIndex = index),
            itemBuilder: (context, index) {
              final banner = banners[index];
              final imageUrl = banner['image_url'] ?? banner['imageUrl'] ?? '';
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: NovaTheme.spacingMd),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(NovaTheme.radiusLg),
                  child: CachedNetworkImage(
                    imageUrl: imageUrl,
                    fit: BoxFit.cover,
                    placeholder: (context, url) => Shimmer.fromColors(
                      baseColor: NovaTheme.grey200,
                      highlightColor: NovaTheme.grey100,
                      child: Container(color: NovaTheme.grey200),
                    ),
                    errorWidget: (context, url, error) => Container(
                      color: NovaTheme.grey100,
                      child: const Icon(Icons.image_not_supported_outlined, color: NovaTheme.grey400, size: 40),
                    ),
                  ),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: NovaTheme.spacingSm),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(
            banners.length,
            (index) => AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              margin: const EdgeInsets.symmetric(horizontal: 3),
              width: _currentBannerIndex == index ? 24 : 8,
              height: 8,
              decoration: BoxDecoration(
                color: _currentBannerIndex == index ? NovaTheme.primaryColor : NovaTheme.grey300,
                borderRadius: BorderRadius.circular(NovaTheme.radiusFull),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildCategoriesFromList(dynamic data) {
    final categories = data is List ? data : [];
    if (categories.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: NovaTheme.spacingMd),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Categories', style: NovaTheme.headingSmall),
              TextButton(
                onPressed: () => Navigator.pushNamed(context, AppRouter.categories),
                child: Text('View All', style: NovaTheme.bodyMedium.copyWith(color: NovaTheme.secondaryColor)),
              ),
            ],
          ),
        ),
        const SizedBox(height: NovaTheme.spacingSm),
        SizedBox(
          height: 100,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: NovaTheme.spacingMd),
            itemCount: categories.length,
            itemBuilder: (context, index) => _buildCategoryItem(categories[index]),
          ),
        ),
      ],
    );
  }

  Widget _buildCategoryItem(dynamic category) {
    final name = category['name'] ?? '';
    final imageUrl = category['image_url'] ?? '';

    return GestureDetector(
      onTap: () => Navigator.pushNamed(context, AppRouter.productList, arguments: {
        'categoryId': category['id'],
        'categoryName': name,
      }),
      child: Container(
        width: 80,
        margin: const EdgeInsets.only(right: NovaTheme.spacingMd),
        child: Column(
          children: [
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: NovaTheme.grey100,
                shape: BoxShape.circle,
                border: Border.all(color: NovaTheme.grey200, width: 1),
              ),
              child: ClipOval(
                child: imageUrl.toString().isNotEmpty
                    ? CachedNetworkImage(
                        imageUrl: imageUrl,
                        fit: BoxFit.cover,
                        placeholder: (context, url) => Shimmer.fromColors(
                          baseColor: NovaTheme.grey200,
                          highlightColor: NovaTheme.grey100,
                          child: Container(color: NovaTheme.grey200),
                        ),
                        errorWidget: (context, url, error) => const Icon(Icons.category_outlined, color: NovaTheme.grey500, size: 28),
                      )
                    : const Icon(Icons.category_outlined, color: NovaTheme.grey500, size: 28),
              ),
            ),
            const SizedBox(height: NovaTheme.spacingSm),
            Text(
              name,
              style: NovaTheme.bodySmall.copyWith(color: NovaTheme.textPrimary, fontSize: 11),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFlashSaleFromSection(dynamic data) {
    final products = data is List ? data : [];
    if (products.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: NovaTheme.spacingMd),
          child: Row(
            children: [
              const Icon(Icons.flash_on_rounded, color: NovaTheme.errorColor, size: 24),
              const SizedBox(width: NovaTheme.spacingSm),
              Text('Flash Sale', style: NovaTheme.headingSmall),
            ],
          ),
        ),
        const SizedBox(height: NovaTheme.spacingSm),
        SizedBox(
          height: 220,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: NovaTheme.spacingMd),
            itemCount: products.length,
            itemBuilder: (context, index) => _buildProductCard(products[index]),
          ),
        ),
      ],
    );
  }

  Widget _buildBestSellersFromList(dynamic data) {
    final products = data is List ? data : [];
    if (products.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: NovaTheme.spacingMd),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Best Sellers', style: NovaTheme.headingSmall),
              TextButton(
                onPressed: () => Navigator.pushNamed(context, AppRouter.productList),
                child: Text('View All', style: NovaTheme.bodyMedium.copyWith(color: NovaTheme.secondaryColor)),
              ),
            ],
          ),
        ),
        const SizedBox(height: NovaTheme.spacingSm),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: NovaTheme.spacingMd),
          child: GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: ResponsiveLayout.gridCrossAxisCount(context),
              childAspectRatio: 0.68,
              crossAxisSpacing: NovaTheme.spacingSm,
              mainAxisSpacing: NovaTheme.spacingSm,
            ),
            itemCount: products.length,
            itemBuilder: (context, index) => _buildProductCard(products[index]),
          ),
        ),
      ],
    );
  }

  Widget _buildProductCard(dynamic product) {
    final title = product['title'] ?? product['name'] ?? '';
    final basePrice = (product['base_price'] ?? product['basePrice'] ?? 0).toDouble();
    final compareAtPrice = product['compare_at_price'] ?? product['compareAtPrice'];
    final images = product['images'] as List<dynamic>? ?? [];
    final imageUrl = images.isNotEmpty ? (images[0]['url'] ?? '') : '';
    final productId = product['id'] ?? '';

    final discountPercent = compareAtPrice != null && compareAtPrice > basePrice
        ? ((compareAtPrice - basePrice) / compareAtPrice * 100).round()
        : 0;

    return GestureDetector(
      onTap: () => Navigator.pushNamed(context, AppRouter.productDetail, arguments: product),
      child: Card(
        elevation: NovaTheme.elevationSm,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(NovaTheme.radiusMd)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              flex: 5,
              child: Stack(
                children: [
                  ClipRRect(
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(NovaTheme.radiusMd)),
                    child: SizedBox(
                      width: double.infinity,
                      height: double.infinity,
                      child: imageUrl.toString().isNotEmpty
                          ? CachedNetworkImage(
                              imageUrl: imageUrl,
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
                          style: const TextStyle(color: NovaTheme.textOnPrimary, fontSize: 11, fontWeight: FontWeight.bold),
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
                      title,
                      style: NovaTheme.bodySmall.copyWith(color: NovaTheme.textPrimary, fontWeight: FontWeight.w500),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('${basePrice.toStringAsFixed(0)} EGP', style: NovaTheme.priceSmall.copyWith(fontSize: 13)),
                        if (compareAtPrice != null && compareAtPrice > basePrice)
                          Text('${compareAtPrice.toStringAsFixed(0)} EGP', style: NovaTheme.discountPrice.copyWith(fontSize: 11)),
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
}

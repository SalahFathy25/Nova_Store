import 'dart:async';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nova_core/nova_core.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../products/bloc/product_bloc.dart';
import '../../products/bloc/product_event.dart';
import '../../products/bloc/product_state.dart';

class SearchPage extends StatefulWidget {
  const SearchPage({super.key});

  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  final TextEditingController _searchController = TextEditingController();
  final FocusNode _focusNode = FocusNode();
  Timer? _debounceTimer;
  List<String> _suggestions = [];
  bool _showSuggestions = false;

  static const String _historyKey = 'search_history';
  static const int _maxHistoryItems = 20;
  List<String> _searchHistory = [];

  final List<String> _popularSearches = [
    'Wireless Headphones',
    'Smart Watch',
    'Laptop Stand',
    'Running Shoes',
    'Phone Case',
    'Bluetooth Speaker',
    'Yoga Mat',
    'Water Bottle',
    'Backpack',
    'Sunglasses',
  ];

  @override
  void initState() {
    super.initState();
    _loadSearchHistory();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _focusNode.requestFocus();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    _focusNode.dispose();
    _debounceTimer?.cancel();
    super.dispose();
  }

  Future<void> _loadSearchHistory() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _searchHistory = prefs.getStringList(_historyKey) ?? [];
    });
  }

  Future<void> _saveSearchHistory() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList(_historyKey, _searchHistory);
  }

  void _addToHistory(String query) {
    if (query.trim().isEmpty) return;
    setState(() {
      _searchHistory.remove(query);
      _searchHistory.insert(0, query);
      if (_searchHistory.length > _maxHistoryItems) {
        _searchHistory = _searchHistory.sublist(0, _maxHistoryItems);
      }
    });
    _saveSearchHistory();
  }

  void _removeFromHistory(String query) {
    setState(() => _searchHistory.remove(query));
    _saveSearchHistory();
  }

  void _clearHistory() {
    setState(() => _searchHistory.clear());
    _saveSearchHistory();
  }

  void _onSearchChanged(String value) {
    _debounceTimer?.cancel();
    if (value.trim().isEmpty) {
      setState(() {
        _suggestions = [];
        _showSuggestions = false;
      });
      return;
    }

    final query = value.toLowerCase();
    final matches = <String>[];

    for (final history in _searchHistory) {
      if (history.toLowerCase().contains(query) && !matches.contains(history)) {
        matches.add(history);
      }
    }

    for (final popular in _popularSearches) {
      if (popular.toLowerCase().contains(query) && !matches.contains(popular)) {
        matches.add(popular);
      }
    }

    setState(() {
      _suggestions = matches.take(5).toList();
      _showSuggestions = _suggestions.isNotEmpty;
    });
  }

  void _performSearch(String query) {
    if (query.trim().isEmpty) return;

    context.read<ProductBloc>().add(LoadProducts(search: query));
    setState(() {
      _showSuggestions = false;
    });
  }

  void _submitSearch(String query) {
    if (query.trim().isEmpty) return;
    _addToHistory(query);
    _focusNode.unfocus();
    setState(() {
      _showSuggestions = false;
    });
    context.read<ProductBloc>().add(LoadProducts(search: query));
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isTablet = screenWidth >= 600;
    final hasQuery = _searchController.text.trim().isNotEmpty;

    return Scaffold(
      backgroundColor: NovaTheme.backgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            _buildSearchBar(),
            if (_showSuggestions && _suggestions.isNotEmpty)
              _buildSuggestionsList(),
            if (!_showSuggestions) ...[
              if (!hasQuery) _buildPreSearchContent(),
              if (hasQuery) BlocBuilder<ProductBloc, ProductState>(
                builder: (context, state) {
                  if (state is ProductLoading) {
                    return const Expanded(
                      child: Center(
                        child: CircularProgressIndicator(
                          color: NovaTheme.secondaryColor,
                        ),
                      ),
                    );
                  }
                  if (state is ProductsLoaded) {
                    return _buildSearchResults(state.products, isTablet);
                  }
                  return _buildSearchResults([], isTablet);
                },
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildSearchBar() {
    return Container(
      padding: const EdgeInsets.fromLTRB(12, 8, 12, 8),
      decoration: const BoxDecoration(
        color: NovaTheme.surfaceColor,
        border: Border(bottom: BorderSide(color: NovaTheme.dividerColor)),
      ),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(
              Icons.arrow_back_ios_new_rounded,
              size: 20,
              color: NovaTheme.textPrimary,
            ),
            onPressed: () => Navigator.of(context).pop(),
          ),
          Expanded(
            child: Container(
              height: 44,
              decoration: BoxDecoration(
                color: NovaTheme.backgroundColor,
                borderRadius: BorderRadius.circular(12),
              ),
              child: TextField(
                controller: _searchController,
                focusNode: _focusNode,
                onChanged: _onSearchChanged,
                onSubmitted: _submitSearch,
                style: const TextStyle(
                  fontSize: 15,
                  color: NovaTheme.textPrimary,
                ),
                decoration: InputDecoration(
                  hintText: 'Search products...',
                  hintStyle: const TextStyle(
                    color: NovaTheme.textHint,
                    fontSize: 15,
                  ),
                  prefixIcon: const Icon(
                    Icons.search_rounded,
                    color: NovaTheme.textHint,
                    size: 22,
                  ),
                  suffixIcon: _searchController.text.isNotEmpty
                      ? IconButton(
                          icon: const Icon(
                            Icons.close_rounded,
                            color: NovaTheme.textHint,
                            size: 20,
                          ),
                          onPressed: () {
                            _searchController.clear();
                            setState(() {
                              _suggestions = [];
                              _showSuggestions = false;
                            });
                            _focusNode.requestFocus();
                          },
                        )
                      : null,
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSuggestionsList() {
    return Container(
      constraints: const BoxConstraints(maxHeight: 300),
      decoration: const BoxDecoration(
        color: NovaTheme.surfaceColor,
        border: Border(bottom: BorderSide(color: NovaTheme.dividerColor)),
      ),
      child: ListView.builder(
        shrinkWrap: true,
        padding: EdgeInsets.zero,
        itemCount: _suggestions.length,
        itemBuilder: (context, index) {
          return Material(
            color: Colors.transparent,
            child: ListTile(
              dense: true,
              leading: const Icon(
                Icons.search_rounded,
                size: 20,
                color: NovaTheme.textHint,
              ),
              title: Text(
                _suggestions[index],
                style: const TextStyle(
                  fontSize: 14,
                  color: NovaTheme.textPrimary,
                ),
              ),
              trailing: const Icon(
                Icons.north_west_rounded,
                size: 16,
                color: NovaTheme.textHint,
              ),
              onTap: () {
                _searchController.text = _suggestions[index];
                _submitSearch(_suggestions[index]);
              },
            ),
          );
        },
      ),
    );
  }

  Widget _buildPreSearchContent() {
    return Expanded(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (_searchHistory.isNotEmpty) ...[
              _buildSectionHeader(
                title: 'Recent Searches',
                onClear: _clearHistory,
              ),
              const SizedBox(height: 12),
              _buildHistoryChips(),
              const SizedBox(height: 28),
            ],
            _buildSectionHeader(title: 'Popular Searches'),
            const SizedBox(height: 12),
            _buildPopularSearches(),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader({
    required String title,
    VoidCallback? onClear,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 17,
            fontWeight: FontWeight.w700,
            color: NovaTheme.textPrimary,
          ),
        ),
        if (onClear != null)
          TextButton(
            onPressed: onClear,
            style: TextButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              minimumSize: Size.zero,
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            ),
            child: const Text(
              'Clear All',
              style: TextStyle(
                fontSize: 13,
                color: NovaTheme.secondaryColor,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildHistoryChips() {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: _searchHistory.map((query) {
        return GestureDetector(
          onTap: () {
            _searchController.text = query;
            _submitSearch(query);
          },
          onLongPress: () => _removeFromHistory(query),
          child: Container(
            padding: const EdgeInsets.symmetric(
              horizontal: 14,
              vertical: 8,
            ),
            decoration: BoxDecoration(
              color: NovaTheme.surfaceColor,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: NovaTheme.borderColor),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.history_rounded,
                  size: 16,
                  color: NovaTheme.textSecondary,
                ),
                const SizedBox(width: 6),
                Text(
                  query,
                  style: const TextStyle(
                    fontSize: 13,
                    color: NovaTheme.textPrimary,
                  ),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildPopularSearches() {
    return Column(
      children: List.generate(_popularSearches.length, (index) {
        final search = _popularSearches[index];
        return InkWell(
          onTap: () {
            _searchController.text = search;
            _submitSearch(search);
          },
          borderRadius: BorderRadius.circular(8),
          child: Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: 12,
              vertical: 12,
            ),
            child: Row(
              children: [
                Container(
                  width: 28,
                  height: 28,
                  decoration: BoxDecoration(
                    color: _getRankColor(index).withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Center(
                    child: Text(
                      '\${index + 1}',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: _getRankColor(index),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    search,
                    style: const TextStyle(
                      fontSize: 15,
                      color: NovaTheme.textPrimary,
                    ),
                  ),
                ),
                const Icon(
                  Icons.north_east_rounded,
                  size: 18,
                  color: NovaTheme.textHint,
                ),
              ],
            ),
          ),
        );
      }),
    );
  }

  Color _getRankColor(int index) {
    switch (index) {
      case 0:
        return NovaTheme.secondaryColor;
      case 1:
        return NovaTheme.primaryColor;
      case 2:
        return const Color(0xFFCD7F32);
      default:
        return NovaTheme.textSecondary;
    }
  }

  Widget _buildSearchResults(List<Product> results, bool isTablet) {
    if (results.isEmpty) {
      return Expanded(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    color: NovaTheme.secondaryColor.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.search_off_rounded,
                    size: 48,
                    color: NovaTheme.secondaryColor,
                  ),
                ),
                const SizedBox(height: 20),
                const Text(
                  'No results found',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: NovaTheme.textPrimary,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Try different keywords or check spelling',
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 14,
                    color: NovaTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
            child: Text(
              '${results.length} result${results.length == 1 ? '' : 's'} found',
              style: const TextStyle(
                fontSize: 14,
                color: NovaTheme.textSecondary,
              ),
            ),
          ),
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.all(12),
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: isTablet ? 3 : 2,
                childAspectRatio: 0.58,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
              ),
              itemCount: results.length,
              itemBuilder: (context, index) {
                return _buildProductCard(results[index]);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProductCard(Product product) {
    final hasDiscount =
        product.compareAtPrice != null && product.compareAtPrice! > product.basePrice;
    final discountPercent = hasDiscount
        ? ((product.compareAtPrice! - product.basePrice) /
                product.compareAtPrice! * 100)
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
                          'EGP \${product.basePrice.toStringAsFixed(2)}',
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: NovaTheme.primaryColor,
                          ),
                        ),
                        if (hasDiscount) ...[
                          const SizedBox(width: 6),
                          Text(
                            'EGP \${product.compareAtPrice!.toStringAsFixed(2)}',
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
                          '4.\${(product.basePrice % 9).round() + 1}',
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: NovaTheme.textPrimary,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          '(\${(product.basePrice % 200).round() + 20})',
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
}
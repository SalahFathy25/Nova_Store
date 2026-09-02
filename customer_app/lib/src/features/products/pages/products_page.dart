import 'package:flutter/material.dart';

import 'product_list_page.dart';

class ProductsPage extends StatelessWidget {
  final String? categoryId;
  final String? categoryName;
  final String? brandId;
  final String? brandName;
  final String? searchQuery;

  const ProductsPage({
    super.key,
    this.categoryId,
    this.categoryName,
    this.brandId,
    this.brandName,
    this.searchQuery,
  });

  @override
  Widget build(BuildContext context) {
    return ProductListPage(
      categoryId: categoryId,
      categoryName: categoryName,
      brandId: brandId,
      brandName: brandName,
      searchQuery: searchQuery,
    );
  }
}

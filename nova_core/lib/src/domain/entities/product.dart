import 'package:equatable/equatable.dart';

class Product extends Equatable {
  final String id;
  final String tenantId;
  final String title;
  final String slug;
  final String? description;
  final String? shortDescription;
  final double basePrice;
  final double? compareAtPrice;
  final String? sku;
  final bool isActive;
  final bool isFeatured;
  final String? categoryId;
  final String? brandId;
  final List<String> tags;
  final List<ProductImage> images;
  final List<ProductVariant> variants;

  const Product({
    required this.id,
    required this.tenantId,
    required this.title,
    required this.slug,
    this.description,
    this.shortDescription,
    required this.basePrice,
    this.compareAtPrice,
    this.sku,
    this.isActive = true,
    this.isFeatured = false,
    this.categoryId,
    this.brandId,
    this.tags = const [],
    this.images = const [],
    this.variants = const [],
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] ?? '',
      tenantId: json['tenant_id'] ?? '',
      title: json['title'] ?? '',
      slug: json['slug'] ?? '',
      description: json['description'],
      shortDescription: json['short_description'],
      basePrice: (json['base_price'] ?? 0).toDouble(),
      compareAtPrice: json['compare_at_price']?.toDouble(),
      sku: json['sku'],
      isActive: json['is_active'] ?? true,
      isFeatured: json['is_featured'] ?? false,
      categoryId: json['category_id'],
      brandId: json['brand_id'],
      tags: List<String>.from(json['tags'] ?? []),
      images: (json['images'] as List?)
              ?.map((e) => ProductImage.fromJson(e))
              .toList() ??
          [],
      variants: (json['variants'] as List?)
              ?.map((e) => ProductVariant.fromJson(e))
              .toList() ??
          [],
    );
  }

  @override
  List<Object?> get props => [id, title, slug, basePrice];
}

class ProductImage extends Equatable {
  final String id;
  final String url;
  final String? altText;
  final int displayOrder;
  final bool isPrimary;

  const ProductImage({
    required this.id,
    required this.url,
    this.altText,
    this.displayOrder = 0,
    this.isPrimary = false,
  });

  factory ProductImage.fromJson(Map<String, dynamic> json) {
    return ProductImage(
      id: json['id'] ?? '',
      url: json['url'] ?? '',
      altText: json['alt_text'],
      displayOrder: json['display_order'] ?? 0,
      isPrimary: json['is_primary'] ?? false,
    );
  }

  @override
  List<Object?> get props => [id, url, isPrimary];
}

class ProductVariant extends Equatable {
  final String id;
  final String sku;
  final String? title;
  final Map<String, dynamic> attributes;
  final double? priceOverride;
  final int stockQuantity;
  final bool isActive;

  const ProductVariant({
    required this.id,
    required this.sku,
    this.title,
    this.attributes = const {},
    this.priceOverride,
    this.stockQuantity = 0,
    this.isActive = true,
  });

  factory ProductVariant.fromJson(Map<String, dynamic> json) {
    return ProductVariant(
      id: json['id'] ?? '',
      sku: json['sku'] ?? '',
      title: json['title'],
      attributes: Map<String, dynamic>.from(json['attributes'] ?? {}),
      priceOverride: json['price_override']?.toDouble(),
      stockQuantity: json['stock_quantity'] ?? 0,
      isActive: json['is_active'] ?? true,
    );
  }

  @override
  List<Object?> get props => [id, sku, stockQuantity];
}

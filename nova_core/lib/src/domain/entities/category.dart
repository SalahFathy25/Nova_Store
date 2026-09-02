import 'package:equatable/equatable.dart';

class Category extends Equatable {
  final String id;
  final String tenantId;
  final String name;
  final String slug;
  final String? description;
  final String? imageUrl;
  final int displayOrder;
  final bool isActive;
  final String? parentId;
  final List<Category> children;

  const Category({
    required this.id,
    required this.tenantId,
    required this.name,
    required this.slug,
    this.description,
    this.imageUrl,
    this.displayOrder = 0,
    this.isActive = true,
    this.parentId,
    this.children = const [],
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'] ?? '',
      tenantId: json['tenant_id'] ?? '',
      name: json['name'] ?? '',
      slug: json['slug'] ?? '',
      description: json['description'],
      imageUrl: json['image_url'],
      displayOrder: json['display_order'] ?? 0,
      isActive: json['is_active'] ?? true,
      parentId: json['parent_id'],
      children: (json['children'] as List?)
              ?.map((e) => Category.fromJson(e))
              .toList() ??
          [],
    );
  }

  @override
  List<Object?> get props => [id, name, slug];
}

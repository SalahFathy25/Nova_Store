import 'package:equatable/equatable.dart';

class Brand extends Equatable {
  final String id;
  final String name;
  final String slug;
  final String? logoUrl;
  final String? description;
  final bool isActive;

  const Brand({
    required this.id,
    required this.name,
    required this.slug,
    this.logoUrl,
    this.description,
    this.isActive = true,
  });

  factory Brand.fromJson(Map<String, dynamic> json) {
    return Brand(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      slug: json['slug'] ?? '',
      logoUrl: json['logo_url'],
      description: json['description'],
      isActive: json['is_active'] ?? true,
    );
  }

  @override
  List<Object?> get props => [id, name, slug];
}

import 'package:equatable/equatable.dart';
import 'product.dart';
import 'category.dart';

class HomeSection extends Equatable {
  final String id;
  final String type;
  final String? title;
  final Map<String, dynamic> config;
  final int displayOrder;
  final List<dynamic> items;

  const HomeSection({
    required this.id,
    required this.type,
    this.title,
    this.config = const {},
    this.displayOrder = 0,
    this.items = const [],
  });

  factory HomeSection.fromJson(Map<String, dynamic> json) {
    List<dynamic> items = [];
    if (json['items'] != null) {
      items = json['items'] as List;
    }
    return HomeSection(
      id: json['id'] ?? '',
      type: json['type'] ?? '',
      title: json['title'],
      config: Map<String, dynamic>.from(json['config'] ?? {}),
      displayOrder: json['display_order'] ?? 0,
      items: items,
    );
  }

  @override
  List<Object?> get props => [id, type, title, displayOrder];
}

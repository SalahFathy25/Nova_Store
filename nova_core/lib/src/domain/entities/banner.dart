import 'package:equatable/equatable.dart';

class BannerItem extends Equatable {
  final String id;
  final String title;
  final String imageUrl;
  final String? linkType;
  final String? linkValue;
  final int displayOrder;

  const BannerItem({
    required this.id,
    required this.title,
    required this.imageUrl,
    this.linkType,
    this.linkValue,
    this.displayOrder = 0,
  });

  factory BannerItem.fromJson(Map<String, dynamic> json) {
    return BannerItem(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      imageUrl: json['image_url'] ?? '',
      linkType: json['link_type'],
      linkValue: json['link_value'],
      displayOrder: json['display_order'] ?? 0,
    );
  }

  @override
  List<Object?> get props => [id, title, imageUrl];
}

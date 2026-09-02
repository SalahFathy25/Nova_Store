import 'package:equatable/equatable.dart';

class WishlistItem extends Equatable {
  final String id;
  final String productId;
  final String? productTitle;
  final double? productPrice;
  final String? imageUrl;
  final DateTime? createdAt;

  const WishlistItem({
    required this.id,
    required this.productId,
    this.productTitle,
    this.productPrice,
    this.imageUrl,
    this.createdAt,
  });

  factory WishlistItem.fromJson(Map<String, dynamic> json) {
    return WishlistItem(
      id: json['id'] ?? '',
      productId: json['product_id'] ?? '',
      productTitle: json['product_title'],
      productPrice: json['product_price']?.toDouble(),
      imageUrl: json['image_url'],
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
    );
  }

  @override
  List<Object?> get props => [id, productId];
}

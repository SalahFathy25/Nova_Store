import 'package:equatable/equatable.dart';

class Review extends Equatable {
  final String id;
  final String productId;
  final String userId;
  final String? userName;
  final String? orderId;
  final int rating;
  final String? title;
  final String? comment;
  final List<String>? images;
  final bool isVerifiedPurchase;
  final bool isApproved;
  final int helpfulCount;
  final DateTime? createdAt;

  const Review({
    required this.id,
    required this.productId,
    required this.userId,
    this.userName,
    this.orderId,
    required this.rating,
    this.title,
    this.comment,
    this.images,
    this.isVerifiedPurchase = false,
    this.isApproved = true,
    this.helpfulCount = 0,
    this.createdAt,
  });

  factory Review.fromJson(Map<String, dynamic> json) {
    return Review(
      id: json['id'] ?? '',
      productId: json['product_id'] ?? '',
      userId: json['user_id'] ?? '',
      userName: json['user']?['full_name'] ?? json['user']?['email'],
      orderId: json['order_id'],
      rating: json['rating'] ?? 0,
      title: json['title'],
      comment: json['comment'],
      images: json['images'] != null ? List<String>.from(json['images']) : null,
      isVerifiedPurchase: json['is_verified_purchase'] ?? false,
      isApproved: json['is_approved'] ?? true,
      helpfulCount: json['helpful_count'] ?? 0,
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
    );
  }

  @override
  List<Object?> get props => [id, productId, userId, rating];
}

class ReviewSummary extends Equatable {
  final double averageRating;
  final int totalReviews;
  final Map<int, int> ratingDistribution;

  const ReviewSummary({
    this.averageRating = 0,
    this.totalReviews = 0,
    this.ratingDistribution = const {1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
  });

  factory ReviewSummary.fromJson(Map<String, dynamic> json) {
    return ReviewSummary(
      averageRating: (json['averageRating'] ?? 0).toDouble(),
      totalReviews: json['total'] ?? 0,
      ratingDistribution: Map<int, int>.from(json['ratingDistribution'] ?? {}),
    );
  }

  @override
  List<Object?> get props => [averageRating, totalReviews];
}

import 'package:equatable/equatable.dart';

abstract class ReviewEvent extends Equatable {
  const ReviewEvent();

  @override
  List<Object?> get props => [];
}

class LoadReviews extends ReviewEvent {
  final String productId;

  const LoadReviews({required this.productId});

  @override
  List<Object?> get props => [productId];
}

class SubmitReview extends ReviewEvent {
  final String productId;
  final int rating;
  final String? title;
  final String? comment;
  final List<String>? images;
  final String? orderId;

  const SubmitReview({
    required this.productId,
    required this.rating,
    this.title,
    this.comment,
    this.images,
    this.orderId,
  });

  @override
  List<Object?> get props => [productId, rating, title, comment, images, orderId];
}

class MarkReviewHelpful extends ReviewEvent {
  final String reviewId;

  const MarkReviewHelpful({required this.reviewId});

  @override
  List<Object?> get props => [reviewId];
}

class DeleteReview extends ReviewEvent {
  final String reviewId;

  const DeleteReview({required this.reviewId});

  @override
  List<Object?> get props => [reviewId];
}

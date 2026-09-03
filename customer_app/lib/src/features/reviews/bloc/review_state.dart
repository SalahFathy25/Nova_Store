import 'package:equatable/equatable.dart';
import 'package:nova_core/nova_core.dart';

abstract class ReviewState extends Equatable {
  const ReviewState();

  @override
  List<Object?> get props => [];
}

class ReviewInitial extends ReviewState {}

class ReviewLoading extends ReviewState {}

class ReviewsLoaded extends ReviewState {
  final List<Review> reviews;
  final ReviewSummary summary;
  final bool hasMore;
  final int page;

  const ReviewsLoaded({
    required this.reviews,
    required this.summary,
    this.hasMore = false,
    this.page = 1,
  });

  @override
  List<Object?> get props => [reviews, summary, hasMore, page];
}

class ReviewSubmitting extends ReviewState {}

class ReviewSubmitted extends ReviewState {
  final Review review;

  const ReviewSubmitted({required this.review});

  @override
  List<Object?> get props => [review];
}

class ReviewError extends ReviewState {
  final String message;

  const ReviewError({required this.message});

  @override
  List<Object?> get props => [message];
}

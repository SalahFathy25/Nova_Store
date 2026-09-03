import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nova_core/nova_core.dart';
import 'review_event.dart';
import 'review_state.dart';

class ReviewBloc extends Bloc<ReviewEvent, ReviewState> {
  final ReviewRepository _reviewRepository;

  ReviewBloc({required ReviewRepository reviewRepository})
      : _reviewRepository = reviewRepository,
        super(ReviewInitial()) {
    on<LoadReviews>(_onLoadReviews);
    on<SubmitReview>(_onSubmitReview);
    on<MarkReviewHelpful>(_onMarkHelpful);
    on<DeleteReview>(_onDeleteReview);
  }

  Future<void> _onLoadReviews(LoadReviews event, Emitter<ReviewState> emit) async {
    emit(ReviewLoading());
    final result = await _reviewRepository.getReviews(event.productId);
    result.fold(
      (failure) => emit(ReviewError(message: failure.message)),
      (data) {
        final reviews = (data['data'] as List?)
                ?.map((r) => Review.fromJson(r as Map<String, dynamic>))
                .toList() ??
            [];
        final summary = ReviewSummary.fromJson(data);
        emit(ReviewsLoaded(
          reviews: reviews,
          summary: summary,
          hasMore: reviews.length >= 20,
          page: 1,
        ));
      },
    );
  }

  Future<void> _onSubmitReview(SubmitReview event, Emitter<ReviewState> emit) async {
    emit(ReviewSubmitting());
    final result = await _reviewRepository.submitReview(
      productId: event.productId,
      rating: event.rating,
      title: event.title,
      comment: event.comment,
      images: event.images,
      orderId: event.orderId,
    );
    result.fold(
      (failure) => emit(ReviewError(message: failure.message)),
      (data) {
        final review = Review.fromJson(data);
        emit(ReviewSubmitted(review: review));
      },
    );
  }

  Future<void> _onMarkHelpful(MarkReviewHelpful event, Emitter<ReviewState> emit) async {
    await _reviewRepository.markHelpful(event.reviewId);
  }

  Future<void> _onDeleteReview(DeleteReview event, Emitter<ReviewState> emit) async {
    await _reviewRepository.deleteReview(event.reviewId);
    if (state is ReviewsLoaded) {
      add(LoadReviews(productId: (state as ReviewsLoaded).reviews.first.productId));
    }
  }
}

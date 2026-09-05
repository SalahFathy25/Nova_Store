import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nova_core/nova_core.dart';
import '../bloc/review_bloc.dart';
import '../bloc/review_state.dart';

class ReviewsListPage extends StatefulWidget {
  final String productId;
  final String productName;

  const ReviewsListPage({
    super.key,
    required this.productId,
    required this.productName,
  });

  @override
  State<ReviewsListPage> createState() => _ReviewsListPageState();
}

class _ReviewsListPageState extends State<ReviewsListPage> {
  int? _selectedRating;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: NovaTheme.backgroundColor,
      appBar: AppBar(
        title: Text('Reviews - ${widget.productName}'),
      ),
      body: Column(
        children: [
          _buildFilterChips(),
          Expanded(
            child: BlocBuilder<ReviewBloc, ReviewState>(
              builder: (context, state) {
                if (state is ReviewLoading) {
                  return const Center(
                    child: CircularProgressIndicator(color: NovaTheme.secondaryColor),
                  );
                }

                if (state is ReviewsLoaded) {
                  var reviews = state.reviews;
                  if (_selectedRating != null) {
                    reviews = reviews.where((r) => r.rating == _selectedRating).toList();
                  }

                  if (reviews.isEmpty) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            _selectedRating != null ? Icons.filter_list_off : Icons.reviews_outlined,
                            size: 64,
                            color: NovaTheme.textHint,
                          ),
                          const SizedBox(height: 16),
                          Text(
                            _selectedRating != null
                                ? 'No $_selectedRating-star reviews'
                                : 'No reviews yet',
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: NovaTheme.textSecondary,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            _selectedRating != null
                                ? 'Try a different filter'
                                : 'Be the first to review this product',
                            style: const TextStyle(
                              fontSize: 14,
                              color: NovaTheme.textHint,
                            ),
                          ),
                        ],
                      ),
                    );
                  }

                  return ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: reviews.length,
                    itemBuilder: (context, index) {
                      final review = reviews[index];
                      return _buildReviewCard(review);
                    },
                  );
                }

                return const SizedBox.shrink();
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChips() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      color: NovaTheme.surfaceColor,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Filter by Rating',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: NovaTheme.textSecondary,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              _buildFilterChip(null, 'All'),
              const SizedBox(width: 8),
              for (int i = 5; i >= 1; i--) ...[
                _buildFilterChip(i, '$i ★'),
                const SizedBox(width: 8),
              ],
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(int? rating, String label) {
    final isSelected = _selectedRating == rating;
    return GestureDetector(
      onTap: () => setState(() => _selectedRating = rating),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? NovaTheme.secondaryColor : NovaTheme.backgroundColor,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? NovaTheme.secondaryColor : NovaTheme.borderColor,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: isSelected ? NovaTheme.surfaceColor : NovaTheme.textPrimary,
          ),
        ),
      ),
    );
  }

  Widget _buildReviewCard(review) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: NovaTheme.surfaceColor,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: NovaTheme.dividerColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: NovaTheme.secondaryColor.withValues(alpha: 0.12),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text(
                    (review.userName ?? 'U')[0].toUpperCase(),
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: NovaTheme.secondaryColor,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      review.userName ?? 'Anonymous',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: NovaTheme.textPrimary,
                      ),
                    ),
                    Text(
                      review.createdAt != null
                          ? '${review.createdAt!.day}/${review.createdAt!.month}/${review.createdAt!.year}'
                          : '',
                      style: const TextStyle(
                        fontSize: 12,
                        color: NovaTheme.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              Row(
                children: List.generate(
                  review.rating.clamp(0, 5),
                  (index) => const Icon(
                    Icons.star_rounded,
                    size: 14,
                    color: NovaTheme.secondaryColor,
                  ),
                ),
              ),
            ],
          ),
          if (review.title != null && review.title!.isNotEmpty) ...[
            const SizedBox(height: 10),
            Text(
              review.title!,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: NovaTheme.textPrimary,
              ),
            ),
          ],
          if (review.comment != null && review.comment!.isNotEmpty) ...[
            const SizedBox(height: 6),
            Text(
              review.comment!,
              style: const TextStyle(
                fontSize: 13,
                height: 1.5,
                color: NovaTheme.textSecondary,
              ),
            ),
          ],
          if (review.isVerifiedPurchase) ...[
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: NovaTheme.successColor.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(4),
              ),
              child: const Text(
                'Verified Purchase',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: NovaTheme.successColor,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

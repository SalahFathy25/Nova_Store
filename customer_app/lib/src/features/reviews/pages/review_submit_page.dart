import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nova_core/nova_core.dart';
import '../bloc/review_bloc.dart';
import '../bloc/review_event.dart';
import '../bloc/review_state.dart';

class ReviewSubmitPage extends StatefulWidget {
  final String productId;
  final String? productName;

  const ReviewSubmitPage({
    super.key,
    required this.productId,
    this.productName,
  });

  @override
  State<ReviewSubmitPage> createState() => _ReviewSubmitPageState();
}

class _ReviewSubmitPageState extends State<ReviewSubmitPage> {
  int _rating = 0;
  final _titleController = TextEditingController();
  final _commentController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _titleController.dispose();
    _commentController.dispose();
    super.dispose();
  }

  void _submitReview() {
    if (_rating == 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select a rating'),
          backgroundColor: NovaTheme.errorColor,
        ),
      );
      return;
    }

    context.read<ReviewBloc>().add(SubmitReview(
          productId: widget.productId,
          rating: _rating,
          title: _titleController.text.trim().isNotEmpty ? _titleController.text.trim() : null,
          comment: _commentController.text.trim().isNotEmpty ? _commentController.text.trim() : null,
        ));
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<ReviewBloc, ReviewState>(
      listener: (context, state) {
        if (state is ReviewSubmitted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Review submitted successfully!'),
              backgroundColor: NovaTheme.successColor,
            ),
          );
          Navigator.pop(context, true);
        } else if (state is ReviewError) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.message),
              backgroundColor: NovaTheme.errorColor,
            ),
          );
        }
      },
      child: Scaffold(
        backgroundColor: NovaTheme.backgroundColor,
        appBar: AppBar(
          title: const Text('Write a Review'),
        ),
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (widget.productName != null) ...[
                  Text(
                    widget.productName!,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: NovaTheme.textPrimary,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 20),
                ],
                const Text(
                  'Your Rating',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: NovaTheme.textPrimary,
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: List.generate(5, (index) {
                    final starIndex = index + 1;
                    return GestureDetector(
                      onTap: () => setState(() => _rating = starIndex),
                      child: Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: Icon(
                          starIndex <= _rating
                              ? Icons.star_rounded
                              : Icons.star_outline_rounded,
                          size: 40,
                          color: starIndex <= _rating
                              ? NovaTheme.secondaryColor
                              : NovaTheme.borderColor,
                        ),
                      ),
                    );
                  }),
                ),
                if (_rating > 0) ...[
                  const SizedBox(height: 8),
                  Text(
                    _getRatingText(_rating),
                    style: const TextStyle(
                      fontSize: 14,
                      color: NovaTheme.textSecondary,
                    ),
                  ),
                ],
                const SizedBox(height: 24),
                const Text(
                  'Title (Optional)',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: NovaTheme.textPrimary,
                  ),
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _titleController,
                  decoration: const InputDecoration(
                    hintText: 'Summarize your experience',
                  ),
                  maxLength: 100,
                ),
                const SizedBox(height: 16),
                const Text(
                  'Your Review (Optional)',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: NovaTheme.textPrimary,
                  ),
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _commentController,
                  maxLines: 5,
                  decoration: const InputDecoration(
                    hintText: 'Tell others about your experience with this product',
                  ),
                  maxLength: 1000,
                ),
                const SizedBox(height: 24),
                BlocBuilder<ReviewBloc, ReviewState>(
                  builder: (context, state) {
                    final isSubmitting = state is ReviewSubmitting;
                    return SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: isSubmitting ? null : _submitReview,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: NovaTheme.primaryColor,
                          foregroundColor: NovaTheme.surfaceColor,
                          disabledBackgroundColor: NovaTheme.borderColor,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: isSubmitting
                            ? const SizedBox(
                                height: 20,
                                width: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: NovaTheme.surfaceColor,
                                ),
                              )
                            : const Text(
                                'Submit Review',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  String _getRatingText(int rating) {
    switch (rating) {
      case 1:
        return 'Poor';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Very Good';
      case 5:
        return 'Excellent';
      default:
        return '';
    }
  }
}

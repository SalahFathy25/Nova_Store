import 'package:flutter/material.dart';
import 'package:nova_core/nova_core.dart';

class OrderConfirmationPage extends StatelessWidget {
  final String orderNumber;

  const OrderConfirmationPage({super.key, required this.orderNumber});

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) {
          Navigator.of(context).popUntil((route) => route.isFirst);
        }
      },
      child: Scaffold(
        backgroundColor: NovaTheme.backgroundColor,
        body: SafeArea(
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(NovaTheme.spacingLg),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _buildSuccessIcon(),
                  const SizedBox(height: NovaTheme.spacingLg),
                  _buildTitle(),
                  const SizedBox(height: NovaTheme.spacingMd),
                  _buildOrderNumber(),
                  const SizedBox(height: NovaTheme.spacingMd),
                  _buildMessage(),
                  const SizedBox(height: NovaTheme.spacingXxl),
                  _buildTrackOrderButton(context),
                  const SizedBox(height: NovaTheme.spacingMd),
                  _buildContinueShoppingButton(context),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSuccessIcon() {
    return Container(
      width: 120,
      height: 120,
      decoration: BoxDecoration(
        color: NovaTheme.successColor.withValues(alpha: 0.1),
        shape: BoxShape.circle,
      ),
      child: Container(
        width: 80,
        height: 80,
        decoration: const BoxDecoration(
          color: NovaTheme.successColor,
          shape: BoxShape.circle,
        ),
        child: const Icon(
          Icons.check,
          size: 48,
          color: NovaTheme.textOnPrimary,
        ),
      ),
    );
  }

  Widget _buildTitle() {
    return const Text(
      'Order Placed Successfully!',
      style: NovaTheme.headingMedium,
      textAlign: TextAlign.center,
    );
  }

  Widget _buildOrderNumber() {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: NovaTheme.spacingMd,
        vertical: NovaTheme.spacingSm,
      ),
      decoration: BoxDecoration(
        color: NovaTheme.surfaceColor,
        borderRadius: BorderRadius.circular(NovaTheme.radiusSm),
        border: Border.all(color: NovaTheme.borderColor),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            'Order Number: ',
            style: TextStyle(
              fontSize: 14,
              color: NovaTheme.textSecondary,
            ),
          ),
          Text(
            orderNumber,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: NovaTheme.primaryColor,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessage() {
    return const Text(
      'Thank you for your order!\nWe will send you a confirmation shortly.',
      textAlign: TextAlign.center,
      style: TextStyle(
        fontSize: 14,
        color: NovaTheme.textSecondary,
        height: 1.5,
      ),
    );
  }

  Widget _buildTrackOrderButton(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 50,
      child: ElevatedButton(
        onPressed: () {
          Navigator.of(context).popUntil((route) => route.isFirst);
          Navigator.pushNamed(context, '/orders');
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: NovaTheme.primaryColor,
          foregroundColor: NovaTheme.textOnPrimary,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(NovaTheme.radiusSm),
          ),
        ),
        child: const Text(
          'Track Order',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  Widget _buildContinueShoppingButton(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 50,
      child: OutlinedButton(
        onPressed: () {
          Navigator.of(context).popUntil((route) => route.isFirst);
        },
        style: OutlinedButton.styleFrom(
          foregroundColor: NovaTheme.primaryColor,
          side: const BorderSide(color: NovaTheme.primaryColor),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(NovaTheme.radiusSm),
          ),
        ),
        child: const Text(
          'Continue Shopping',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }
}

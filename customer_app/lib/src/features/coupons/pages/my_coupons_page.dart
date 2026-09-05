import 'package:flutter/material.dart';
import 'package:nova_core/nova_core.dart';
import '../../../core/di/injection.dart';

class MyCouponsPage extends StatefulWidget {
  const MyCouponsPage({super.key});

  @override
  State<MyCouponsPage> createState() => _MyCouponsPageState();
}

class _MyCouponsPageState extends State<MyCouponsPage> {
  final _codeController = TextEditingController();
  bool _isValidating = false;
  final List<Map<String, dynamic>> _appliedCoupons = [];

  @override
  void dispose() {
    _codeController.dispose();
    super.dispose();
  }

  Future<void> _validateCoupon() async {
    final code = _codeController.text.trim().toUpperCase();
    if (code.isEmpty) return;

    setState(() => _isValidating = true);

    final couponRepo = getIt<CouponRepository>();
    final result = await couponRepo.validateCoupon(code: code, subtotal: 100);

    if (!mounted) return;

    result.fold(
      (failure) {
        setState(() => _isValidating = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(failure.message), backgroundColor: NovaTheme.errorColor),
        );
      },
      (validation) {
        setState(() {
          _isValidating = false;
          if (validation.valid) {
            _appliedCoupons.add({
              'code': validation.code ?? code,
              'type': validation.type ?? 'fixed',
              'discount': validation.discountAmount ?? 0,
              'message': validation.message ?? 'Valid coupon',
            });
            _codeController.clear();
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(validation.message ?? 'Coupon applied!'),
                backgroundColor: NovaTheme.successColor,
              ),
            );
          } else {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(validation.message ?? 'Invalid coupon'),
                backgroundColor: NovaTheme.errorColor,
              ),
            );
          }
        });
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: NovaTheme.backgroundColor,
      appBar: AppBar(title: const Text('My Coupons')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildCouponInput(),
              const SizedBox(height: 24),
              if (_appliedCoupons.isNotEmpty) ...[
                const Text(
                  'Your Coupons',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: NovaTheme.textPrimary),
                ),
                const SizedBox(height: 12),
                ..._appliedCoupons.map((coupon) => _buildCouponCard(coupon)),
              ] else ...[
                Center(
                  child: Padding(
                    padding: const EdgeInsets.only(top: 60),
                    child: Column(
                      children: [
                        Container(
                          width: 80,
                          height: 80,
                          decoration: BoxDecoration(
                            color: NovaTheme.secondaryColor.withOpacity(0.1),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.local_offer_outlined, size: 40, color: NovaTheme.secondaryColor),
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          'No coupons yet',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: NovaTheme.textPrimary),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Enter a coupon code above to get started',
                          style: TextStyle(fontSize: 14, color: NovaTheme.textSecondary),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCouponInput() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: NovaTheme.surfaceColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: NovaTheme.borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Have a coupon code?',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: NovaTheme.textPrimary),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _codeController,
                  textCapitalization: TextCapitalization.characters,
                  decoration: InputDecoration(
                    hintText: 'Enter code',
                    hintStyle: const TextStyle(color: NovaTheme.textHint),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: NovaTheme.borderColor),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: NovaTheme.primaryColor),
                    ),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              ElevatedButton(
                onPressed: _isValidating ? null : _validateCoupon,
                style: ElevatedButton.styleFrom(
                  backgroundColor: NovaTheme.primaryColor,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                child: _isValidating
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                      )
                    : const Text('Apply'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCouponCard(Map<String, dynamic> coupon) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: NovaTheme.surfaceColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: NovaTheme.successColor.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: NovaTheme.successColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.local_offer, color: NovaTheme.successColor, size: 24),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  coupon['code'] ?? '',
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: NovaTheme.textPrimary),
                ),
                const SizedBox(height: 4),
                Text(
                  coupon['message'] ?? '',
                  style: const TextStyle(fontSize: 13, color: NovaTheme.textSecondary),
                ),
              ],
            ),
          ),
          Text(
            coupon['type'] == 'percentage'
                ? '${(coupon['discount'] ?? 0).toInt()}% OFF'
                : 'EGP ${(coupon['discount'] ?? 0).toStringAsFixed(0)} OFF',
            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: NovaTheme.successColor),
          ),
        ],
      ),
    );
  }
}

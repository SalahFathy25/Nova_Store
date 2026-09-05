import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nova_core/nova_core.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../addresses/bloc/address_bloc.dart';
import '../../addresses/bloc/address_state.dart';
import '../../app_config/app_config_cubit.dart';
import '../../app_config/app_config_state.dart';
import '../../cart/bloc/cart_bloc.dart';
import '../../cart/bloc/cart_state.dart';
import '../../orders/bloc/order_bloc.dart';
import '../../orders/bloc/order_event.dart';
import '../../orders/bloc/order_state.dart';
import '../../../core/di/injection.dart';
import 'address_form_page.dart';
import 'order_confirmation_page.dart';

class CheckoutPage extends StatefulWidget {
  const CheckoutPage({super.key});

  @override
  State<CheckoutPage> createState() => _CheckoutPageState();
}

class _CheckoutPageState extends State<CheckoutPage> {
  int _currentStep = 0;
  Address? _selectedAddress;
  String _selectedPayment = 'cod';
  String _couponCode = '';
  double _couponDiscount = 0;
  final _couponController = TextEditingController();
  final _notesController = TextEditingController();
  bool _isPlacingOrder = false;
  bool _isApplyingCoupon = false;
  String _deliveryType = 'instant';
  DateTime? _scheduledDeliveryDate;
  String? _selectedTimeSlot;

  List<Address> _addresses = [];

  static const double _shippingFee = 30;

  double _getSubtotal(List<CartItem> cartItems) =>
      cartItems.fold(0, (sum, item) => sum + item.totalPrice);

  double _getTax(BuildContext context, List<CartItem> cartItems) {
    final state = context.read<AppConfigCubit>().state;
    final taxRate = state is AppConfigLoaded ? state.config.features.taxRate : 0.14;
    return _getSubtotal(cartItems) * taxRate;
  }

  double get _discount => _couponDiscount;

  double _getGrandTotal(BuildContext context, List<CartItem> cartItems) =>
      _getSubtotal(cartItems) + _shippingFee + _getTax(context, cartItems) - _discount;

  void _applyCoupon() async {
    final code = _couponController.text.trim().toUpperCase();
    if (code.isEmpty) return;

    setState(() => _isApplyingCoupon = true);

    final cartState = context.read<CartBloc>().state;
    final currentSubtotal = cartState is CartLoaded ? _getSubtotal(cartState.cartItems) : 0.0;

    final couponRepo = getIt<CouponRepository>();
    final result = await couponRepo.validateCoupon(
      code: code,
      subtotal: currentSubtotal,
    );

    if (!mounted) return;

    result.fold(
      (failure) {
        setState(() {
          _isApplyingCoupon = false;
          _couponCode = '';
          _couponDiscount = 0;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(failure.message),
            backgroundColor: NovaTheme.errorColor,
          ),
        );
      },
      (validation) {
        setState(() {
          _isApplyingCoupon = false;
          if (validation.valid) {
            _couponCode = code;
            _couponDiscount = validation.discountAmount ?? 0;
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(validation.message ?? 'Coupon applied!'),
                backgroundColor: NovaTheme.successColor,
              ),
            );
          } else {
            _couponCode = '';
            _couponDiscount = 0;
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(validation.message ?? 'Invalid coupon code'),
                backgroundColor: NovaTheme.errorColor,
              ),
            );
          }
        });
      },
    );
  }

  void _removeCoupon() {
    setState(() {
      _couponCode = '';
      _couponDiscount = 0;
      _couponController.clear();
    });
  }

  void _nextStep() {
    if (_currentStep == 0 && _selectedAddress == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select an address'),
          backgroundColor: NovaTheme.errorColor,
        ),
      );
      return;
    }
    if (_currentStep < 2) {
      setState(() => _currentStep++);
    }
  }

  void _previousStep() {
    if (_currentStep > 0) {
      setState(() => _currentStep--);
    }
  }

  void _placeOrder() {
    if (_selectedAddress == null) return;
    setState(() => _isPlacingOrder = true);
    context.read<OrderBloc>().add(CreateOrder(
      addressId: _selectedAddress!.id,
      paymentMethod: _selectedPayment,
      couponCode: _couponCode.isNotEmpty ? _couponCode : null,
      notes: _notesController.text.isNotEmpty ? _notesController.text : null,
      deliveryType: _deliveryType,
      scheduledTimeSlot: _deliveryType == 'scheduled' ? _selectedTimeSlot : null,
      scheduledDeliveryDate: _deliveryType == 'scheduled' ? _scheduledDeliveryDate : null,
    ));
  }

  Future<void> _pickDeliveryDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: _scheduledDeliveryDate ?? now.add(const Duration(days: 1)),
      firstDate: now.add(const Duration(days: 1)),
      lastDate: now.add(const Duration(days: 30)),
    );
    if (picked != null) {
      setState(() => _scheduledDeliveryDate = picked);
    }
  }

  Future<void> _addNewAddress() async {
    final result = await Navigator.push<Address>(
      context,
      MaterialPageRoute(builder: (_) => const AddressFormPage()),
    );
    if (result != null) {
      setState(() {
        _addresses.add(result);
        _selectedAddress = result;
      });
    }
  }

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    _couponController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<OrderBloc, OrderState>(
      listener: (context, state) {
        if (state is OrderCreated) {
          setState(() => _isPlacingOrder = false);
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (_) => OrderConfirmationPage(
                orderNumber: state.order.orderNumber ?? '',
              ),
            ),
          );
        } else if (state is OrderError) {
          setState(() => _isPlacingOrder = false);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.message),
              backgroundColor: NovaTheme.errorColor,
            ),
          );
        }
      },
      child: BlocBuilder<CartBloc, CartState>(
        builder: (context, cartState) {
          final cartItems = cartState is CartLoaded ? cartState.cartItems : <CartItem>[];
          final subtotal = _getSubtotal(cartItems);
          final tax = _getTax(context, cartItems);
          final grandTotal = _getGrandTotal(context, cartItems);

          return Scaffold(
            backgroundColor: NovaTheme.backgroundColor,
            appBar: AppBar(
              title: const Text('Checkout'),
              leading: IconButton(
                icon: const Icon(Icons.arrow_back_ios),
                onPressed: () {
                  if (_currentStep > 0) {
                    _previousStep();
                  } else {
                    Navigator.pop(context);
                  }
                },
              ),
            ),
            body: SafeArea(
              child: Column(
                children: [
                  _buildStepIndicator(),
                  Expanded(
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.all(NovaTheme.spacingMd),
                      child: _buildCurrentStep(cartItems, subtotal, tax, grandTotal),
                    ),
                  ),
                  _buildBottomBar(grandTotal),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildStepIndicator() {
    final steps = ['Address', 'Payment', 'Confirm'];
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: NovaTheme.spacingMd,
        vertical: NovaTheme.spacingLg,
      ),
      color: NovaTheme.surfaceColor,
      child: Row(
        children: List.generate(steps.length * 2 - 1, (index) {
          if (index.isOdd) {
            final stepIndex = index ~/ 2;
            return Expanded(
              child: Container(
                height: 2,
                color: stepIndex < _currentStep
                    ? NovaTheme.primaryColor
                    : NovaTheme.borderColor,
              ),
            );
          }
          final stepIndex = index ~/ 2;
          final isActive = stepIndex <= _currentStep;
          final isCompleted = stepIndex < _currentStep;
          return Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: isActive
                      ? NovaTheme.primaryColor
                      : NovaTheme.backgroundColor,
                  border: Border.all(
                    color: isActive
                        ? NovaTheme.primaryColor
                        : NovaTheme.borderColor,
                  ),
                ),
                child: Center(
                  child: isCompleted
                      ? const Icon(
                          Icons.check,
                          size: 18,
                          color: NovaTheme.textOnPrimary,
                        )
                      : Text(
                          '${stepIndex + 1}',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: isActive
                                ? NovaTheme.textOnPrimary
                                : NovaTheme.textHint,
                          ),
                        ),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                steps[stepIndex],
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
                  color: isActive ? NovaTheme.textPrimary : NovaTheme.textHint,
                ),
              ),
            ],
          );
        }),
      ),
    );
  }

  Widget _buildCurrentStep(List<CartItem> cartItems, double subtotal, double tax, double grandTotal) {
    switch (_currentStep) {
      case 0:
        return _buildAddressStep();
      case 1:
        return _buildPaymentStep();
      case 2:
        return _buildConfirmStep(cartItems, subtotal, tax, grandTotal);
      default:
        return const SizedBox.shrink();
    }
  }

  Widget _buildAddressStep() {
    return BlocBuilder<AddressBloc, AddressState>(
      builder: (context, state) {
        if (state is AddressLoading) {
          return const Center(
            child: CircularProgressIndicator(color: NovaTheme.secondaryColor),
          );
        }
        if (state is AddressesLoaded) {
          _addresses = state.addresses;
          if (_addresses.isNotEmpty && _selectedAddress == null) {
            _selectedAddress = _addresses.firstWhere(
              (a) => a.isDefault,
              orElse: () => _addresses.first,
            );
          } else if (_selectedAddress != null && !_addresses.any((a) => a.id == _selectedAddress!.id)) {
            _selectedAddress = _addresses.isNotEmpty ? _addresses.first : null;
          }
        }
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Select Delivery Address',
              style: NovaTheme.headingSmall,
            ),
            const SizedBox(height: NovaTheme.spacingMd),
            ..._addresses.map((address) => _buildAddressCard(address)),
            const SizedBox(height: NovaTheme.spacingMd),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: _addNewAddress,
                icon: const Icon(Icons.add_location_alt_outlined),
                label: const Text('Add New Address'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: NovaTheme.primaryColor,
                  side: const BorderSide(color: NovaTheme.primaryColor),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(NovaTheme.radiusSm),
                  ),
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildAddressCard(Address address) {
    final isSelected = _selectedAddress?.id == address.id;
    return GestureDetector(
      onTap: () => setState(() => _selectedAddress = address),
      child: Container(
        margin: const EdgeInsets.only(bottom: NovaTheme.spacingSm),
        padding: const EdgeInsets.all(NovaTheme.spacingMd),
        decoration: BoxDecoration(
          color: NovaTheme.surfaceColor,
          borderRadius: BorderRadius.circular(NovaTheme.radiusMd),
          border: Border.all(
            color: isSelected ? NovaTheme.primaryColor : NovaTheme.borderColor,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Radio<Address>(
              value: address,
              groupValue: _selectedAddress,
              onChanged: (value) {
                if (value != null) setState(() => _selectedAddress = value);
              },
              activeColor: NovaTheme.primaryColor,
            ),
            const SizedBox(width: NovaTheme.spacingSm),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        address.label,
                        style: const TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 14,
                          color: NovaTheme.textPrimary,
                        ),
                      ),
                      if (address.isDefault) ...[
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: NovaTheme.secondaryColor.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(
                              NovaTheme.radiusFull,
                            ),
                          ),
                          child: const Text(
                            'Default',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                              color: NovaTheme.secondaryColor,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    address.fullAddress,
                    style: NovaTheme.bodySmall,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
            const Icon(
              Icons.chevron_right,
              color: NovaTheme.textHint,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Delivery Type',
          style: NovaTheme.headingSmall,
        ),
        const SizedBox(height: NovaTheme.spacingSm),
        Row(
          children: [
            Expanded(
              child: _buildDeliveryTypeOption(
                value: 'instant',
                title: 'Instant',
                subtitle: '1-3 business days',
                icon: Icons.local_shipping_outlined,
              ),
            ),
            const SizedBox(width: NovaTheme.spacingSm),
            Expanded(
              child: _buildDeliveryTypeOption(
                value: 'scheduled',
                title: 'Scheduled',
                subtitle: 'Choose date & time',
                icon: Icons.calendar_today_outlined,
              ),
            ),
          ],
        ),
        if (_deliveryType == 'scheduled') ...[
          const SizedBox(height: NovaTheme.spacingMd),
          _buildScheduledDeliverySection(),
        ],
        const SizedBox(height: NovaTheme.spacingLg),
        const Text(
          'Payment Method',
          style: NovaTheme.headingSmall,
        ),
        const SizedBox(height: NovaTheme.spacingMd),
        _buildPaymentOption(
          value: 'cod',
          title: 'Cash on Delivery',
          subtitle: 'Pay when you receive your order',
          icon: Icons.money,
        ),
        const SizedBox(height: NovaTheme.spacingSm),
        _buildPaymentOption(
          value: 'card',
          title: 'Credit/Debit Card',
          subtitle: 'Visa, Mastercard, etc.',
          icon: Icons.credit_card_outlined,
          isComingSoon: true,
        ),
        const SizedBox(height: NovaTheme.spacingSm),
        _buildPaymentOption(
          value: 'wallet',
          title: 'Mobile Wallet',
          subtitle: 'Vodafone Cash, Fawry, etc.',
          icon: Icons.account_balance_wallet_outlined,
          isComingSoon: true,
        ),
      ],
    );
  }

  Widget _buildDeliveryTypeOption({
    required String value,
    required String title,
    required String subtitle,
    required IconData icon,
  }) {
    final isSelected = _deliveryType == value;
    return GestureDetector(
      onTap: () => setState(() {
        _deliveryType = value;
        if (value == 'instant') {
          _scheduledDeliveryDate = null;
          _selectedTimeSlot = null;
        }
      }),
      child: Container(
        padding: const EdgeInsets.all(NovaTheme.spacingMd),
        decoration: BoxDecoration(
          color: NovaTheme.surfaceColor,
          borderRadius: BorderRadius.circular(NovaTheme.radiusMd),
          border: Border.all(
            color: isSelected ? NovaTheme.primaryColor : NovaTheme.borderColor,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Column(
          children: [
            Icon(icon, color: isSelected ? NovaTheme.primaryColor : NovaTheme.textHint, size: 28),
            const SizedBox(height: 8),
            Text(
              title,
              style: TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 14,
                color: isSelected ? NovaTheme.primaryColor : NovaTheme.textPrimary,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              style: const TextStyle(fontSize: 11, color: NovaTheme.textSecondary),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildScheduledDeliverySection() {
    return Container(
      padding: const EdgeInsets.all(NovaTheme.spacingMd),
      decoration: BoxDecoration(
        color: NovaTheme.surfaceColor,
        borderRadius: BorderRadius.circular(NovaTheme.radiusMd),
        border: Border.all(color: NovaTheme.borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.calendar_today_outlined, size: 18, color: NovaTheme.primaryColor),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  _scheduledDeliveryDate != null
                      ? '${_scheduledDeliveryDate!.day}/${_scheduledDeliveryDate!.month}/${_scheduledDeliveryDate!.year}'
                      : 'Select delivery date',
                  style: TextStyle(
                    fontSize: 14,
                    color: _scheduledDeliveryDate != null ? NovaTheme.textPrimary : NovaTheme.textHint,
                  ),
                ),
              ),
              TextButton(
                onPressed: _pickDeliveryDate,
                child: const Text('Pick Date'),
              ),
            ],
          ),
          if (_scheduledDeliveryDate != null) ...[
            const Divider(height: 24),
            const Text(
              'Select time slot',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: NovaTheme.textSecondary),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                _buildTimeSlot('09:00 - 12:00'),
                _buildTimeSlot('12:00 - 15:00'),
                _buildTimeSlot('15:00 - 18:00'),
                _buildTimeSlot('18:00 - 21:00'),
              ],
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildTimeSlot(String slot) {
    final isSelected = _selectedTimeSlot == slot;
    return GestureDetector(
      onTap: () => setState(() => _selectedTimeSlot = slot),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? NovaTheme.primaryColor : NovaTheme.backgroundColor,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? NovaTheme.primaryColor : NovaTheme.borderColor,
          ),
        ),
        child: Text(
          slot,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w500,
            color: isSelected ? Colors.white : NovaTheme.textPrimary,
          ),
        ),
      ),
    );
  }

  Widget _buildPaymentOption({
    required String value,
    required String title,
    required String subtitle,
    required IconData icon,
    bool isComingSoon = false,
  }) {
    final isSelected = _selectedPayment == value;
    return GestureDetector(
      onTap: isComingSoon
          ? null
          : () => setState(() => _selectedPayment = value),
      child: Container(
        padding: const EdgeInsets.all(NovaTheme.spacingMd),
        decoration: BoxDecoration(
          color: NovaTheme.surfaceColor,
          borderRadius: BorderRadius.circular(NovaTheme.radiusMd),
          border: Border.all(
            color: isSelected ? NovaTheme.primaryColor : NovaTheme.borderColor,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Radio<String>(
              value: value,
              groupValue: _selectedPayment,
              onChanged: isComingSoon
                  ? null
                  : (v) {
                      if (v != null) setState(() => _selectedPayment = v);
                    },
              activeColor: NovaTheme.primaryColor,
            ),
            const SizedBox(width: NovaTheme.spacingSm),
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: isSelected
                    ? NovaTheme.primaryColor.withValues(alpha: 0.1)
                    : NovaTheme.backgroundColor,
                borderRadius: BorderRadius.circular(NovaTheme.radiusSm),
              ),
              child: Icon(
                icon,
                color: isSelected ? NovaTheme.primaryColor : NovaTheme.textHint,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 14,
                          color: NovaTheme.textPrimary,
                        ),
                      ),
                      if (isComingSoon) ...[
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: NovaTheme.warningColor.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(
                              NovaTheme.radiusFull,
                            ),
                          ),
                          child: const Text(
                            'Coming Soon',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                              color: NovaTheme.warningColor,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: NovaTheme.bodySmall,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildConfirmStep(List<CartItem> cartItems, double subtotal, double tax, double grandTotal) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Order Summary',
          style: NovaTheme.headingSmall,
        ),
        const SizedBox(height: NovaTheme.spacingMd),
        _buildSection(
          title: 'Items (${cartItems.length})',
          child: Column(
            children: cartItems.map((item) {
              return Padding(
                padding: const EdgeInsets.only(bottom: NovaTheme.spacingSm),
                child: Row(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(NovaTheme.radiusSm),
                      child: CachedNetworkImage(
                        imageUrl: item.imageUrl ?? '',
                        width: 48,
                        height: 48,
                        fit: BoxFit.cover,
                        errorWidget: (context, url, error) => Container(
                          width: 48,
                          height: 48,
                          color: NovaTheme.dividerColor,
                          child: const Icon(
                            Icons.image_outlined,
                            color: NovaTheme.textHint,
                            size: 24,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            item.productTitle ?? '',
                            style: const TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                              color: NovaTheme.textPrimary,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Text(
                            'Qty: ${item.quantity}',
                            style: NovaTheme.bodySmall,
                          ),
                        ],
                      ),
                    ),
                    Text(
                      '${item.totalPrice.toStringAsFixed(0)} ج.م',
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: NovaTheme.textPrimary,
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
        ),
        const SizedBox(height: NovaTheme.spacingMd),
        _buildSection(
          title: 'Delivery Address',
          child: _selectedAddress != null
              ? Text(
                  _selectedAddress!.fullAddress,
                  style: NovaTheme.bodyMedium,
                )
              : const Text(
                  'No address selected',
                  style: TextStyle(color: NovaTheme.textHint),
                ),
        ),
        const SizedBox(height: NovaTheme.spacingMd),
        _buildSection(
          title: 'Payment Method',
          child: Text(
            _getPaymentLabel(_selectedPayment),
            style: NovaTheme.bodyMedium,
          ),
        ),
        const SizedBox(height: NovaTheme.spacingMd),
        _buildSection(
          title: 'Coupon',
          child: _couponCode.isNotEmpty
              ? Row(
                  children: [
                    const Icon(
                      Icons.local_offer,
                      size: 16,
                      color: NovaTheme.successColor,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        _couponCode,
                        style: const TextStyle(
                          fontWeight: FontWeight.w600,
                          color: NovaTheme.successColor,
                        ),
                      ),
                    ),
                    TextButton(
                      onPressed: _removeCoupon,
                      child: const Text(
                        'Remove',
                        style: TextStyle(color: NovaTheme.errorColor),
                      ),
                    ),
                  ],
                )
              : Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _couponController,
                        decoration: const InputDecoration(
                          hintText: 'Enter coupon code',
                          isDense: true,
                          contentPadding: EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 10,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton(
                      onPressed: _isApplyingCoupon ? null : _applyCoupon,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: NovaTheme.secondaryColor,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 12,
                        ),
                      ),
                      child: _isApplyingCoupon
                          ? const SizedBox(
                              height: 16,
                              width: 16,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : const Text('Apply'),
                    ),
                  ],
                ),
        ),
        const SizedBox(height: NovaTheme.spacingMd),
        _buildSection(
          title: 'Notes',
          child: TextField(
            controller: _notesController,
            maxLines: 3,
            decoration: const InputDecoration(
              hintText: 'Add delivery notes (optional)',
              isDense: true,
            ),
          ),
        ),
        const SizedBox(height: NovaTheme.spacingMd),
        _buildSection(
          title: 'Scheduled Delivery (Optional)',
          child: InkWell(
            onTap: _pickDeliveryDate,
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                border: Border.all(color: NovaTheme.borderColor),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  const Icon(Icons.calendar_today, size: 20, color: NovaTheme.textSecondary),
                  const SizedBox(width: 12),
                  Text(
                    _scheduledDeliveryDate != null
                        ? '${_scheduledDeliveryDate!.day}/${_scheduledDeliveryDate!.month}/${_scheduledDeliveryDate!.year}'
                        : 'Select delivery date',
                    style: TextStyle(
                      fontSize: 14,
                      color: _scheduledDeliveryDate != null ? NovaTheme.textPrimary : NovaTheme.textHint,
                    ),
                  ),
                  if (_scheduledDeliveryDate != null) ...[
                    const Spacer(),
                    GestureDetector(
                      onTap: () => setState(() => _scheduledDeliveryDate = null),
                      child: const Icon(Icons.close, size: 18, color: NovaTheme.textSecondary),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
        const SizedBox(height: NovaTheme.spacingMd),
        _buildPriceBreakdown(subtotal, tax, grandTotal),
      ],
    );
  }

  Widget _buildSection({required String title, required Widget child}) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(NovaTheme.spacingMd),
      decoration: BoxDecoration(
        color: NovaTheme.surfaceColor,
        borderRadius: BorderRadius.circular(NovaTheme.radiusMd),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: NovaTheme.textSecondary,
            ),
          ),
          const SizedBox(height: NovaTheme.spacingSm),
          child,
        ],
      ),
    );
  }

  Widget _buildPriceBreakdown(double subtotal, double tax, double grandTotal) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(NovaTheme.spacingMd),
      decoration: BoxDecoration(
        color: NovaTheme.surfaceColor,
        borderRadius: BorderRadius.circular(NovaTheme.radiusMd),
      ),
      child: Column(
        children: [
          _buildPriceRow('Subtotal', subtotal),
          _buildPriceRow('Shipping', _shippingFee),
          _buildPriceRow('Tax (14%)', tax),
          if (_discount > 0)
            _buildPriceRow('Discount', -_discount, isDiscount: true),
          const Divider(color: NovaTheme.borderColor, height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Grand Total',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: NovaTheme.textPrimary,
                ),
              ),
              Text(
                '${grandTotal.toStringAsFixed(2)} ج.م',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: NovaTheme.primaryColor,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPriceRow(String label, double amount, {bool isDiscount = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 14,
              color: NovaTheme.textSecondary,
            ),
          ),
          Text(
            '${isDiscount ? '-' : ''}${amount.abs().toStringAsFixed(2)} ج.م',
            style: TextStyle(
              fontSize: 14,
              color: isDiscount ? NovaTheme.successColor : NovaTheme.textPrimary,
              fontWeight: isDiscount ? FontWeight.w500 : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }

  String _getPaymentLabel(String method) {
    switch (method) {
      case 'cod':
        return 'Cash on Delivery';
      case 'card':
        return 'Credit/Debit Card';
      case 'wallet':
        return 'Mobile Wallet';
      default:
        return method;
    }
  }

  Widget _buildBottomBar(double grandTotal) {
    if (_currentStep == 2) {
      return Container(
        padding: const EdgeInsets.all(NovaTheme.spacingMd),
        decoration: BoxDecoration(
          color: NovaTheme.surfaceColor,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 10,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: SafeArea(
          child: SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton(
              onPressed: _isPlacingOrder ? null : _placeOrder,
              style: ElevatedButton.styleFrom(
                backgroundColor: NovaTheme.primaryColor,
                foregroundColor: NovaTheme.textOnPrimary,
                disabledBackgroundColor: NovaTheme.borderColor,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(NovaTheme.radiusSm),
                ),
              ),
              child: _isPlacingOrder
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: NovaTheme.textOnPrimary,
                      ),
                    )
                   : Text(
                      'Place Order - ${grandTotal.toStringAsFixed(2)} ج.م',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
            ),
          ),
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.all(NovaTheme.spacingMd),
      decoration: BoxDecoration(
        color: NovaTheme.surfaceColor,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        child: SizedBox(
          width: double.infinity,
          height: 50,
          child: ElevatedButton(
            onPressed: _nextStep,
            style: ElevatedButton.styleFrom(
              backgroundColor: NovaTheme.primaryColor,
              foregroundColor: NovaTheme.textOnPrimary,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(NovaTheme.radiusSm),
              ),
            ),
            child: Text(
              _currentStep == 0 ? 'Continue to Payment' : 'Review Order',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

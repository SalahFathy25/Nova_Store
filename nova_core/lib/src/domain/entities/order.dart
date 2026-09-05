import 'package:equatable/equatable.dart';

class Order extends Equatable {
  final String id;
  final String orderNumber;
  final String status;
  final double totalAmount;
  final double subtotal;
  final double discountAmount;
  final double shippingFee;
  final double taxAmount;
  final double grandTotal;
  final String paymentMethod;
  final String paymentStatus;
  final Map<String, dynamic>? shippingAddress;
  final String? notes;
  final String? couponCode;
  final double couponDiscount;
  final String deliveryType;
  final String? scheduledTimeSlot;
  final DateTime? scheduledDeliveryDate;
  final DateTime? estimatedDeliveryDate;
  final List<OrderItem> items;
  final List<OrderStatusEvent> statusHistory;
  final DateTime? createdAt;

  const Order({
    required this.id,
    required this.orderNumber,
    required this.status,
    this.totalAmount = 0,
    this.subtotal = 0,
    this.discountAmount = 0,
    this.shippingFee = 0,
    this.taxAmount = 0,
    this.grandTotal = 0,
    this.paymentMethod = 'cod',
    this.paymentStatus = 'Pending',
    this.shippingAddress,
    this.notes,
    this.couponCode,
    this.couponDiscount = 0,
    this.deliveryType = 'instant',
    this.scheduledTimeSlot,
    this.scheduledDeliveryDate,
    this.estimatedDeliveryDate,
    this.items = const [],
    this.statusHistory = const [],
    this.createdAt,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'] ?? '',
      orderNumber: json['order_number'] ?? '',
      status: json['status'] ?? 'Pending',
      totalAmount: (json['total_amount'] ?? 0).toDouble(),
      subtotal: (json['subtotal'] ?? 0).toDouble(),
      discountAmount: (json['discount_amount'] ?? 0).toDouble(),
      shippingFee: (json['shipping_fee'] ?? 0).toDouble(),
      taxAmount: (json['tax_amount'] ?? 0).toDouble(),
      grandTotal: (json['grand_total'] ?? 0).toDouble(),
      paymentMethod: json['payment_method'] ?? 'cod',
      paymentStatus: json['payment_status'] ?? 'Pending',
      shippingAddress: json['shipping_address'],
      notes: json['notes'],
      couponCode: json['coupon_code'],
      couponDiscount: (json['coupon_discount'] ?? 0).toDouble(),
      deliveryType: json['delivery_type'] ?? 'instant',
      scheduledTimeSlot: json['scheduled_time_slot'],
      scheduledDeliveryDate: json['scheduled_delivery_date'] != null ? DateTime.parse(json['scheduled_delivery_date']) : null,
      estimatedDeliveryDate: json['estimated_delivery_date'] != null ? DateTime.parse(json['estimated_delivery_date']) : null,
      items: (json['items'] as List?)?.map((e) => OrderItem.fromJson(e)).toList() ?? [],
      statusHistory: (json['status_history'] as List?)?.map((e) => OrderStatusEvent.fromJson(e)).toList() ?? [],
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
    );
  }

  @override
  List<Object?> get props => [id, orderNumber, status, grandTotal, deliveryType];
}

class OrderItem extends Equatable {
  final String id;
  final String productId;
  final String? productVariantId;
  final String productTitle;
  final String? variantTitle;
  final int quantity;
  final double unitPrice;
  final double totalPrice;
  final double discountAmount;
  final double taxAmount;
  final String? imageUrl;

  const OrderItem({
    required this.id,
    required this.productId,
    this.productVariantId,
    required this.productTitle,
    this.variantTitle,
    this.quantity = 1,
    this.unitPrice = 0,
    this.totalPrice = 0,
    this.discountAmount = 0,
    this.taxAmount = 0,
    this.imageUrl,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    return OrderItem(
      id: json['id'] ?? '',
      productId: json['product_id'] ?? '',
      productVariantId: json['product_variant_id'],
      productTitle: json['product_title'] ?? '',
      variantTitle: json['variant_title'],
      quantity: json['quantity'] ?? 1,
      unitPrice: (json['unit_price'] ?? 0).toDouble(),
      totalPrice: (json['total_price'] ?? 0).toDouble(),
      discountAmount: (json['discount_amount'] ?? 0).toDouble(),
      taxAmount: (json['tax_amount'] ?? 0).toDouble(),
      imageUrl: json['image_url'],
    );
  }

  @override
  List<Object?> get props => [id, productTitle, quantity];
}

class OrderStatusEvent extends Equatable {
  final String status;
  final String? note;
  final DateTime createdAt;

  const OrderStatusEvent({
    required this.status,
    this.note,
    required this.createdAt,
  });

  factory OrderStatusEvent.fromJson(Map<String, dynamic> json) {
    return OrderStatusEvent(
      status: json['status'] ?? '',
      note: json['note'],
      createdAt: DateTime.parse(json['created_at']),
    );
  }

  @override
  List<Object?> get props => [status, createdAt];
}

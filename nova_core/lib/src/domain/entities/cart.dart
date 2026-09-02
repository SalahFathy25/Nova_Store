import 'package:equatable/equatable.dart';

class Cart extends Equatable {
  final String id;
  final String? userId;
  final String? sessionId;
  final String? couponCode;
  final String? notes;
  final List<CartItem> items;
  final double subtotal;
  final double discount;
  final double total;
  final int itemCount;

  const Cart({
    required this.id,
    this.userId,
    this.sessionId,
    this.couponCode,
    this.notes,
    this.items = const [],
    this.subtotal = 0,
    this.discount = 0,
    this.total = 0,
    this.itemCount = 0,
  });

  factory Cart.fromJson(Map<String, dynamic> json) {
    return Cart(
      id: json['id'] ?? '',
      userId: json['user_id'],
      sessionId: json['session_id'],
      couponCode: json['coupon_code'],
      notes: json['notes'],
      items: (json['items'] as List?)?.map((e) => CartItem.fromJson(e)).toList() ?? [],
      subtotal: (json['subtotal'] ?? 0).toDouble(),
      discount: (json['discount'] ?? 0).toDouble(),
      total: (json['total'] ?? 0).toDouble(),
      itemCount: json['item_count'] ?? 0,
    );
  }

  @override
  List<Object?> get props => [id, items, subtotal, total];
}

class CartItem extends Equatable {
  final String id;
  final String productVariantId;
  final String? productTitle;
  final String? variantTitle;
  final String? imageUrl;
  final int quantity;
  final double unitPrice;
  final double discountAmount;
  final double totalPrice;
  final int stockQuantity;

  const CartItem({
    required this.id,
    required this.productVariantId,
    this.productTitle,
    this.variantTitle,
    this.imageUrl,
    this.quantity = 1,
    this.unitPrice = 0,
    this.discountAmount = 0,
    this.totalPrice = 0,
    this.stockQuantity = 0,
  });

  factory CartItem.fromJson(Map<String, dynamic> json) {
    return CartItem(
      id: json['id'] ?? '',
      productVariantId: json['product_variant_id'] ?? '',
      productTitle: json['product_title'],
      variantTitle: json['variant_title'],
      imageUrl: json['image_url'],
      quantity: json['quantity'] ?? 1,
      unitPrice: (json['unit_price'] ?? 0).toDouble(),
      discountAmount: (json['discount_amount'] ?? 0).toDouble(),
      totalPrice: (json['total_price'] ?? 0).toDouble(),
      stockQuantity: json['stock_quantity'] ?? 0,
    );
  }

  @override
  List<Object?> get props => [id, productVariantId, quantity];
}

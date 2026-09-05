import 'package:equatable/equatable.dart';
import 'package:nova_core/nova_core.dart';

abstract class OrderEvent extends Equatable {
  const OrderEvent();

  @override
  List<Object?> get props => [];
}

class LoadOrders extends OrderEvent {
  final int page;

  const LoadOrders({this.page = 1});

  @override
  List<Object?> get props => [page];
}

class LoadOrderDetail extends OrderEvent {
  final String orderId;

  const LoadOrderDetail({required this.orderId});

  @override
  List<Object?> get props => [orderId];
}

class CreateOrder extends OrderEvent {
  final String addressId;
  final String paymentMethod;
  final String? couponCode;
  final String? notes;
  final String deliveryType;
  final DateTime? scheduledDeliveryDate;

  const CreateOrder({
    required this.addressId,
    required this.paymentMethod,
    this.couponCode,
    this.notes,
    this.deliveryType = 'instant',
    this.scheduledDeliveryDate,
  });

  @override
  List<Object?> get props => [addressId, paymentMethod, couponCode, notes, deliveryType, scheduledDeliveryDate];
}

class CancelOrder extends OrderEvent {
  final String orderId;

  const CancelOrder({required this.orderId});

  @override
  List<Object?> get props => [orderId];
}

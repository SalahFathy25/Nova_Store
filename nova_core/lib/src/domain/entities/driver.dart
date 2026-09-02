import 'package:equatable/equatable.dart';

class Driver extends Equatable {
  final String id;
  final String fullName;
  final String? email;
  final String? phone;
  final String? avatarUrl;
  final bool isActive;
  final String currentStatus;
  final Map<String, dynamic>? currentLocation;
  final DateTime? createdAt;

  const Driver({
    required this.id,
    required this.fullName,
    this.email,
    this.phone,
    this.avatarUrl,
    this.isActive = true,
    this.currentStatus = 'Offline',
    this.currentLocation,
    this.createdAt,
  });

  factory Driver.fromJson(Map<String, dynamic> json) {
    return Driver(
      id: json['id'] ?? '',
      fullName: json['full_name'] ?? '',
      email: json['email'],
      phone: json['phone'],
      avatarUrl: json['avatar_url'],
      isActive: json['is_active'] ?? true,
      currentStatus: json['current_status'] ?? 'Offline',
      currentLocation: json['current_location'],
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
    );
  }

  @override
  List<Object?> get props => [id, fullName, currentStatus];
}

class DriverStats extends Equatable {
  final int totalShifts;
  final int totalOrders;
  final int deliveredOrders;
  final int failedOrders;
  final double totalEarnings;
  final String deliveryRate;

  const DriverStats({
    this.totalShifts = 0,
    this.totalOrders = 0,
    this.deliveredOrders = 0,
    this.failedOrders = 0,
    this.totalEarnings = 0,
    this.deliveryRate = '0',
  });

  factory DriverStats.fromJson(Map<String, dynamic> json) {
    return DriverStats(
      totalShifts: json['total_shifts'] ?? 0,
      totalOrders: json['total_orders'] ?? 0,
      deliveredOrders: json['delivered_orders'] ?? 0,
      failedOrders: json['failed_orders'] ?? 0,
      totalEarnings: (json['total_earnings'] ?? 0).toDouble(),
      deliveryRate: json['delivery_rate'] ?? '0',
    );
  }

  @override
  List<Object?> get props => [totalShifts, totalOrders, totalEarnings];
}

class DeliveryOrder extends Equatable {
  final String id;
  final String parentOrderId;
  final String? driverId;
  final String orderStatus;
  final String paymentStatus;
  final String deliveryStatus;
  final double subtotal;
  final double deliveryFee;
  final double netAmount;
  final String? deliveryOtp;
  final DateTime? estimatedDelivery;
  final DateTime? actualDelivery;
  final String? notes;
  final Map<String, dynamic>? parentOrder;
  final DateTime? createdAt;

  const DeliveryOrder({
    required this.id,
    required this.parentOrderId,
    this.driverId,
    this.orderStatus = 'Pending',
    this.paymentStatus = 'Pending',
    this.deliveryStatus = 'Unassigned',
    this.subtotal = 0,
    this.deliveryFee = 0,
    this.netAmount = 0,
    this.deliveryOtp,
    this.estimatedDelivery,
    this.actualDelivery,
    this.notes,
    this.parentOrder,
    this.createdAt,
  });

  factory DeliveryOrder.fromJson(Map<String, dynamic> json) {
    return DeliveryOrder(
      id: json['id'] ?? '',
      parentOrderId: json['parent_order_id'] ?? '',
      driverId: json['driver_id'],
      orderStatus: json['order_status'] ?? 'Pending',
      paymentStatus: json['payment_status'] ?? 'Pending',
      deliveryStatus: json['delivery_status'] ?? 'Unassigned',
      subtotal: (json['subtotal'] ?? 0).toDouble(),
      deliveryFee: (json['delivery_fee'] ?? 0).toDouble(),
      netAmount: (json['net_amount'] ?? 0).toDouble(),
      deliveryOtp: json['delivery_otp'],
      estimatedDelivery: json['estimated_delivery'] != null ? DateTime.parse(json['estimated_delivery']) : null,
      actualDelivery: json['actual_delivery'] != null ? DateTime.parse(json['actual_delivery']) : null,
      notes: json['notes'],
      parentOrder: json['parent_order'],
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
    );
  }

  @override
  List<Object?> get props => [id, parentOrderId, deliveryStatus];
}

class DeliveryShift extends Equatable {
  final String id;
  final String driverId;
  final String status;
  final DateTime startedAt;
  final DateTime? endedAt;
  final int totalOrders;
  final int totalDelivered;
  final int totalFailed;
  final double totalEarnings;
  final Map<String, dynamic>? currentLocation;
  final DateTime? createdAt;

  const DeliveryShift({
    required this.id,
    required this.driverId,
    this.status = 'Offline',
    required this.startedAt,
    this.endedAt,
    this.totalOrders = 0,
    this.totalDelivered = 0,
    this.totalFailed = 0,
    this.totalEarnings = 0,
    this.currentLocation,
    this.createdAt,
  });

  factory DeliveryShift.fromJson(Map<String, dynamic> json) {
    return DeliveryShift(
      id: json['id'] ?? '',
      driverId: json['driver_id'] ?? '',
      status: json['status'] ?? 'Offline',
      startedAt: DateTime.parse(json['started_at']),
      endedAt: json['ended_at'] != null ? DateTime.parse(json['ended_at']) : null,
      totalOrders: json['total_orders'] ?? 0,
      totalDelivered: json['total_delivered'] ?? 0,
      totalFailed: json['total_failed'] ?? 0,
      totalEarnings: (json['total_earnings'] ?? 0).toDouble(),
      currentLocation: json['current_location'],
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
    );
  }

  @override
  List<Object?> get props => [id, status, totalOrders];
}

class CashLedgerEntry extends Equatable {
  final String id;
  final String driverId;
  final String shiftId;
  final String? subOrderId;
  final double amount;
  final String type;
  final String? notes;
  final DateTime createdAt;

  const CashLedgerEntry({
    required this.id,
    required this.driverId,
    required this.shiftId,
    this.subOrderId,
    required this.amount,
    required this.type,
    this.notes,
    required this.createdAt,
  });

  factory CashLedgerEntry.fromJson(Map<String, dynamic> json) {
    return CashLedgerEntry(
      id: json['id'] ?? '',
      driverId: json['driver_id'] ?? '',
      shiftId: json['shift_id'] ?? '',
      subOrderId: json['sub_order_id'],
      amount: (json['amount'] ?? 0).toDouble(),
      type: json['type'] ?? 'collected',
      notes: json['notes'],
      createdAt: DateTime.parse(json['created_at']),
    );
  }

  @override
  List<Object?> get props => [id, amount, type];
}

class CashSummary extends Equatable {
  final double totalEarnings;
  final double totalCollected;
  final double pendingSubmissions;

  const CashSummary({
    this.totalEarnings = 0,
    this.totalCollected = 0,
    this.pendingSubmissions = 0,
  });

  factory CashSummary.fromJson(Map<String, dynamic> json) {
    return CashSummary(
      totalEarnings: (json['total_earnings'] ?? 0).toDouble(),
      totalCollected: (json['total_collected'] ?? 0).toDouble(),
      pendingSubmissions: (json['pending_submissions'] ?? 0).toDouble(),
    );
  }

  @override
  List<Object?> get props => [totalEarnings, totalCollected];
}

class DeliveryZone extends Equatable {
  final String id;
  final String name;
  final Map<String, dynamic> coordinates;
  final double? radiusKm;
  final double flatFee;
  final double? freeAbove;
  final bool isActive;

  const DeliveryZone({
    required this.id,
    required this.name,
    required this.coordinates,
    this.radiusKm,
    this.flatFee = 0,
    this.freeAbove,
    this.isActive = true,
  });

  factory DeliveryZone.fromJson(Map<String, dynamic> json) {
    return DeliveryZone(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      coordinates: json['coordinates'] ?? {},
      radiusKm: json['radius_km']?.toDouble(),
      flatFee: (json['flat_fee'] ?? 0).toDouble(),
      freeAbove: json['free_above']?.toDouble(),
      isActive: json['is_active'] ?? true,
    );
  }

  @override
  List<Object?> get props => [id, name, isActive];
}

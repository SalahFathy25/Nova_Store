import 'package:equatable/equatable.dart';

abstract class OrderState extends Equatable {
  const OrderState();

  @override
  List<Object?> get props => [];
}

class OrderInitial extends OrderState {}

class OrderLoading extends OrderState {}

class OrdersLoaded extends OrderState {
  final List<dynamic> orders;
  final int total;
  final int page;
  final int totalPages;

  const OrdersLoaded({
    required this.orders,
    required this.total,
    required this.page,
    required this.totalPages,
  });

  @override
  List<Object?> get props => [orders, total, page, totalPages];
}

class OrderDetailLoaded extends OrderState {
  final Map<String, dynamic> order;

  const OrderDetailLoaded({required this.order});

  @override
  List<Object?> get props => [order];
}

class OrderCreated extends OrderState {
  final Map<String, dynamic> order;

  const OrderCreated({required this.order});

  @override
  List<Object?> get props => [order];
}

class OrderError extends OrderState {
  final String message;

  const OrderError({required this.message});

  @override
  List<Object?> get props => [message];
}

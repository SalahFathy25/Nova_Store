import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nova_core/nova_core.dart';
import 'order_event.dart';
import 'order_state.dart';

class OrderBloc extends Bloc<OrderEvent, OrderState> {
  final OrderRepository _orderRepository;

  OrderBloc({required OrderRepository orderRepository})
      : _orderRepository = orderRepository,
        super(OrderInitial()) {
    on<LoadOrders>(_onLoadOrders);
    on<LoadOrderDetail>(_onLoadOrderDetail);
    on<CreateOrder>(_onCreateOrder);
    on<CancelOrder>(_onCancelOrder);
  }

  Future<void> _onLoadOrders(LoadOrders event, Emitter<OrderState> emit) async {
    emit(OrderLoading());
    final result = await _orderRepository.getOrders(page: event.page);
    result.fold(
      (failure) => emit(OrderError(message: failure.message)),
      (data) => emit(OrdersLoaded(
        orders: data['data'] ?? [],
        total: data['total'] ?? 0,
        page: data['page'] ?? 1,
        totalPages: data['total_pages'] ?? 0,
      )),
    );
  }

  Future<void> _onLoadOrderDetail(LoadOrderDetail event, Emitter<OrderState> emit) async {
    emit(OrderLoading());
    final result = await _orderRepository.getOrder(event.orderId);
    result.fold(
      (failure) => emit(OrderError(message: failure.message)),
      (data) => emit(OrderDetailLoaded(order: data)),
    );
  }

  Future<void> _onCreateOrder(CreateOrder event, Emitter<OrderState> emit) async {
    emit(OrderLoading());
    final result = await _orderRepository.createOrder(
      addressId: event.addressId,
      paymentMethod: event.paymentMethod,
      couponCode: event.couponCode,
      notes: event.notes,
    );
    result.fold(
      (failure) => emit(OrderError(message: failure.message)),
      (data) => emit(OrderCreated(order: data)),
    );
  }

  Future<void> _onCancelOrder(CancelOrder event, Emitter<OrderState> emit) async {
    emit(OrderLoading());
    final result = await _orderRepository.cancelOrder(event.orderId);
    result.fold(
      (failure) => emit(OrderError(message: failure.message)),
      (_) => add(LoadOrderDetail(orderId: event.orderId)),
    );
  }
}

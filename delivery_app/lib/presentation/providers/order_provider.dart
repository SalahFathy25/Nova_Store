import 'package:flutter/material.dart';
import 'package:nova_core/nova_core.dart';

class OrderProvider extends ChangeNotifier {
  final DeliveryRemoteDataSource _remoteDataSource;

  List<DeliveryOrder> _orders = [];
  List<DeliveryOrder> _myOrders = [];
  DeliveryOrder? _selectedOrder;
  bool _isLoading = false;
  String? _error;

  OrderProvider({required DeliveryRemoteDataSource remoteDataSource})
      : _remoteDataSource = remoteDataSource;

  List<DeliveryOrder> get orders => _orders;
  List<DeliveryOrder> get myOrders => _myOrders;
  DeliveryOrder? get selectedOrder => _selectedOrder;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadUnassignedOrders() async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _remoteDataSource.getUnassignedOrders();
      _orders = (response.data as List?)
              ?.map((e) => DeliveryOrder.fromJson(e))
              .toList() ??
          [];
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> loadMyOrders({String? status}) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _remoteDataSource.getMyOrders(status: status);
      _myOrders = (response.data as List?)
              ?.map((e) => DeliveryOrder.fromJson(e))
              .toList() ??
          [];
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> selectOrder(DeliveryOrder order) async {
    _selectedOrder = order;
    notifyListeners();
  }

  Future<bool> updateOrderStatus(String subOrderId, String status, {String? notes}) async {
    try {
      await _remoteDataSource.updateOrderStatus(subOrderId, status, notes: notes);
      await loadMyOrders();
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<bool> verifyOtp(String subOrderId, String otp) async {
    try {
      await _remoteDataSource.verifyDeliveryOtp(subOrderId, otp);
      await loadMyOrders();
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }
}

import 'package:flutter/material.dart';
import 'package:nova_core/nova_core.dart';

class ShiftProvider extends ChangeNotifier {
  final DeliveryRemoteDataSource _remoteDataSource;

  DeliveryShift? _activeShift;
  bool _isLoading = false;
  String? _error;

  ShiftProvider({required DeliveryRemoteDataSource remoteDataSource})
      : _remoteDataSource = remoteDataSource;

  DeliveryShift? get activeShift => _activeShift;
  bool get isLoading => _isLoading;
  bool get isOnline => _activeShift?.status == 'Online' || _activeShift?.status == 'On Delivery';
  String? get error => _error;

  Future<void> loadActiveShift() async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _remoteDataSource.getActiveShift();
      if (response.data != null) {
        _activeShift = DeliveryShift.fromJson(response.data!);
      } else {
        _activeShift = null;
      }
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<bool> startShift() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _remoteDataSource.startShift();
      _activeShift = DeliveryShift.fromJson(response.data!);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> endShift() async {
    if (_activeShift == null) return false;

    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _remoteDataSource.endShift(_activeShift!.id);
      _activeShift = DeliveryShift.fromJson(response.data!);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
}

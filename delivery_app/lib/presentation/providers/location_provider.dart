import 'dart:async';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:nova_core/nova_core.dart';
import '../../core/services/socket_service.dart';
import '../../core/services/location_service.dart';

class LocationProvider extends ChangeNotifier {
  final DeliveryRemoteDataSource _remoteDataSource;
  final LocationService _locationService;
  final SocketService _socketService;

  Position? _currentPosition;
  Timer? _updateTimer;
  bool _isTracking = false;

  LocationProvider({
    required DeliveryRemoteDataSource remoteDataSource,
    required LocationService locationService,
    required SocketService socketService,
  })  : _remoteDataSource = remoteDataSource,
        _locationService = locationService,
        _socketService = socketService;

  Position? get currentPosition => _currentPosition;
  bool get isTracking => _isTracking;

  Future<void> startTracking({String? subOrderId}) async {
    if (_isTracking) return;

    final hasPermission = await _locationService.checkAndRequestPermission();
    if (!hasPermission) return;

    _isTracking = true;
    notifyListeners();

    _locationService.locationStream.listen((position) {
      _currentPosition = position;
      _socketService.sendLocationUpdate(position.latitude, position.longitude, subOrderId: subOrderId);
      _updateLocationOnServer(position, subOrderId);
    });

    _locationService.startTracking(intervalSeconds: 10);
  }

  void stopTracking() {
    _isTracking = false;
    _locationService.stopTracking();
    _updateTimer?.cancel();
    notifyListeners();
  }

  Future<void> _updateLocationOnServer(Position position, String? subOrderId) async {
    try {
      await _remoteDataSource.updateLocation(
        latitude: position.latitude,
        longitude: position.longitude,
        speed: position.speed,
        heading: position.heading,
        subOrderId: subOrderId,
      );
    } catch (e) {
      print('Failed to update location: $e');
    }
  }

  double? distanceTo(double targetLat, double targetLng) {
    if (_currentPosition == null) return null;
    return _locationService.distanceBetween(
      _currentPosition!.latitude,
      _currentPosition!.longitude,
      targetLat,
      targetLng,
    );
  }

  @override
  void dispose() {
    stopTracking();
    _locationService.dispose();
    super.dispose();
  }
}

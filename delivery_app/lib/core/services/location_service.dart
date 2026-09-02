import 'dart:async';
import 'package:geolocator/geolocator.dart';

class LocationService {
  StreamSubscription<Position>? _positionSubscription;
  final _locationController = StreamController<Position>.broadcast();

  Stream<Position> get locationStream => _locationController.stream;

  Future<bool> checkAndRequestPermission() async {
    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
    }
    return permission == LocationPermission.always || permission == LocationPermission.whileInUse;
  }

  Future<Position?> getCurrentPosition() async {
    try {
      return await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
          timeLimit: Duration(seconds: 10),
        ),
      );
    } catch (e) {
      return null;
    }
  }

  void startTracking({int intervalSeconds = 10}) {
    _positionSubscription?.cancel();
    _positionSubscription = Geolocator.getPositionStream(
      locationSettings: LocationSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: 50,
        timeLimit: Duration(seconds: intervalSeconds),
      ),
    ).listen((position) {
      _locationController.add(position);
    });
  }

  void stopTracking() {
    _positionSubscription?.cancel();
    _positionSubscription = null;
  }

  double distanceBetween(double lat1, double lng1, double lat2, double lng2) {
    return Geolocator.distanceBetween(lat1, lng1, lat2, lng2);
  }

  void dispose() {
    stopTracking();
    _locationController.close();
  }
}

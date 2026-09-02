import 'package:socket_io_client/socket_io_client.dart' as IO;
import '../config/app_config.dart';

class SocketService {
  IO.Socket? _socket;
  final Map<String, Function(dynamic)> _listeners = {};

  void connect(String token) {
    _socket = IO.io(
      AppConfig.wsUrl,
      IO.OptionBuilder()
          .setTransports(['websocket'])
          .enableAutoConnect()
          .enableReconnection()
          .setReconnectionDelay(5000)
          .setAuth({'token': token})
          .build(),
    );

    _socket!.onConnect((_) {
      print('Socket connected');
    });

    _socket!.onDisconnect((_) {
      print('Socket disconnected');
    });

    _socket!.onError((error) {
      print('Socket error: $error');
    });
  }

  void disconnect() {
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
  }

  void on(String event, Function(dynamic) callback) {
    _listeners[event] = callback;
    _socket?.on(event, callback);
  }

  void off(String event) {
    _listeners.remove(event);
    _socket?.off(event);
  }

  void emit(String event, dynamic data) {
    _socket?.emit(event, data);
  }

  void sendLocationUpdate(double lat, double lng, {String? subOrderId}) {
    emit('driver:location', {
      'latitude': lat,
      'longitude': lng,
      if (subOrderId != null) 'sub_order_id': subOrderId,
    });
  }

  void sendStatusUpdate(String status) {
    emit('driver:status', {'status': status});
  }

  bool get isConnected => _socket?.connected ?? false;
}

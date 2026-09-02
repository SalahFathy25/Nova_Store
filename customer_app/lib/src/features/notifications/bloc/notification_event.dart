import 'package:equatable/equatable.dart';

abstract class NotificationEvent extends Equatable {
  const NotificationEvent();

  @override
  List<Object?> get props => [];
}

class LoadNotifications extends NotificationEvent {
  final int page;

  const LoadNotifications({this.page = 1});

  @override
  List<Object?> get props => [page];
}

class LoadUnreadCount extends NotificationEvent {
  const LoadUnreadCount();
}

class MarkAsRead extends NotificationEvent {
  final String notificationId;

  const MarkAsRead({required this.notificationId});

  @override
  List<Object?> get props => [notificationId];
}

class MarkAllAsRead extends NotificationEvent {
  const MarkAllAsRead();
}

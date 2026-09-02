import 'package:equatable/equatable.dart';

abstract class NotificationState extends Equatable {
  const NotificationState();

  @override
  List<Object?> get props => [];
}

class NotificationInitial extends NotificationState {}

class NotificationLoading extends NotificationState {}

class NotificationsLoaded extends NotificationState {
  final List<dynamic> notifications;
  final int unreadCount;
  final int total;
  final int page;
  final int totalPages;

  const NotificationsLoaded({
    required this.notifications,
    required this.unreadCount,
    required this.total,
    required this.page,
    required this.totalPages,
  });

  @override
  List<Object?> get props => [notifications, unreadCount, total, page, totalPages];
}

class NotificationError extends NotificationState {
  final String message;

  const NotificationError({required this.message});

  @override
  List<Object?> get props => [message];
}

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nova_core/nova_core.dart';
import 'notification_event.dart';
import 'notification_state.dart';

class NotificationBloc extends Bloc<NotificationEvent, NotificationState> {
  final NotificationRepository _notificationRepository;

  NotificationBloc({required NotificationRepository notificationRepository})
      : _notificationRepository = notificationRepository,
        super(NotificationInitial()) {
    on<LoadNotifications>(_onLoadNotifications);
    on<LoadUnreadCount>(_onLoadUnreadCount);
    on<MarkAsRead>(_onMarkAsRead);
    on<MarkAllAsRead>(_onMarkAllAsRead);
  }

  Future<void> _onLoadNotifications(LoadNotifications event, Emitter<NotificationState> emit) async {
    emit(NotificationLoading());
    final notificationsResult = await _notificationRepository.getNotifications(page: event.page);
    final unreadResult = await _notificationRepository.getUnreadCount();

    notificationsResult.fold(
      (failure) => emit(NotificationError(message: failure.message)),
      (data) {
        unreadResult.fold(
          (failure) => emit(NotificationError(message: failure.message)),
          (unreadCount) => emit(NotificationsLoaded(
            notifications: data['data'] ?? [],
            unreadCount: unreadCount,
            total: data['total'] ?? 0,
            page: data['page'] ?? 1,
            totalPages: data['total_pages'] ?? 0,
          )),
        );
      },
    );
  }

  Future<void> _onLoadUnreadCount(LoadUnreadCount event, Emitter<NotificationState> emit) async {
    final result = await _notificationRepository.getUnreadCount();
    result.fold(
      (failure) => {},
      (unreadCount) {
        if (state is NotificationsLoaded) {
          final current = state as NotificationsLoaded;
          emit(NotificationsLoaded(
            notifications: current.notifications,
            unreadCount: unreadCount,
            total: current.total,
            page: current.page,
            totalPages: current.totalPages,
          ));
        }
      },
    );
  }

  Future<void> _onMarkAsRead(MarkAsRead event, Emitter<NotificationState> emit) async {
    await _notificationRepository.markAsRead(event.notificationId);
    add(const LoadNotifications());
  }

  Future<void> _onMarkAllAsRead(MarkAllAsRead event, Emitter<NotificationState> emit) async {
    await _notificationRepository.markAllAsRead();
    add(const LoadNotifications());
  }
}

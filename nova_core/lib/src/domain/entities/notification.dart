import 'package:equatable/equatable.dart';

class AppNotification extends Equatable {
  final String id;
  final String title;
  final String body;
  final Map<String, dynamic>? data;
  final String type;
  final bool isRead;
  final DateTime? createdAt;

  const AppNotification({
    required this.id,
    required this.title,
    required this.body,
    this.data,
    this.type = 'in_app',
    this.isRead = false,
    this.createdAt,
  });

  factory AppNotification.fromJson(Map<String, dynamic> json) {
    return AppNotification(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      body: json['body'] ?? '',
      data: json['data'],
      type: json['type'] ?? 'in_app',
      isRead: json['is_read'] ?? false,
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
    );
  }

  @override
  List<Object?> get props => [id, title, isRead];
}

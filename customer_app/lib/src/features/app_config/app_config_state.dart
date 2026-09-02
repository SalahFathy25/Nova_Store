import 'package:equatable/equatable.dart';
import 'package:nova_core/nova_core.dart';

abstract class AppConfigState extends Equatable {
  const AppConfigState();

  @override
  List<Object?> get props => [];
}

class AppConfigInitial extends AppConfigState {}

class AppConfigLoading extends AppConfigState {}

class AppConfigLoaded extends AppConfigState {
  final AppConfig config;

  const AppConfigLoaded(this.config);

  @override
  List<Object?> get props => [config];
}

class AppConfigError extends AppConfigState {
  final String message;

  const AppConfigError(this.message);

  @override
  List<Object?> get props => [message];
}

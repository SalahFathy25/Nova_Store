import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nova_core/nova_core.dart';
import 'app_config_state.dart';

class AppConfigCubit extends Cubit<AppConfigState> {
  final AppConfigRepository _repository;

  AppConfigCubit({required AppConfigRepository repository})
      : _repository = repository,
        super(AppConfigInitial());

  AppConfig get config {
    final s = state;
    if (s is AppConfigLoaded) return s.config;
    return AppConfig.empty;
  }

  Future<void> loadConfig({bool forceRefresh = false}) async {
    emit(AppConfigLoading());
    try {
      final config = await _repository.getConfig(forceRefresh: forceRefresh);
      emit(AppConfigLoaded(config));
    } catch (e) {
      emit(AppConfigError(e.toString()));
    }
  }
}

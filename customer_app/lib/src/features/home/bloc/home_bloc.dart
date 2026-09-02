import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nova_core/nova_core.dart';
import 'home_event.dart';
import 'home_state.dart';

class HomeBloc extends Bloc<HomeEvent, HomeState> {
  final HomeRepository _homeRepository;

  HomeBloc({required HomeRepository homeRepository})
      : _homeRepository = homeRepository,
        super(HomeInitial()) {
    on<LoadHome>(_onLoadHome);
    on<RefreshHome>(_onRefreshHome);
  }

  Future<void> _onLoadHome(LoadHome event, Emitter<HomeState> emit) async {
    emit(HomeLoading());
    final sectionsResult = await _homeRepository.getHomeSections();
    final bannersResult = await _homeRepository.getBanners();

    sectionsResult.fold(
      (failure) => emit(HomeError(message: failure.message)),
      (sections) {
        bannersResult.fold(
          (failure) => emit(HomeError(message: failure.message)),
          (banners) => emit(HomeLoaded(sections: sections, banners: banners)),
        );
      },
    );
  }

  Future<void> _onRefreshHome(RefreshHome event, Emitter<HomeState> emit) async {
    final sectionsResult = await _homeRepository.getHomeSections();
    final bannersResult = await _homeRepository.getBanners();

    sectionsResult.fold(
      (failure) => emit(HomeError(message: failure.message)),
      (sections) {
        bannersResult.fold(
          (failure) => emit(HomeError(message: failure.message)),
          (banners) => emit(HomeLoaded(sections: sections, banners: banners)),
        );
      },
    );
  }
}

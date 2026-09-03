import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nova_core/nova_core.dart';
import 'wishlist_event.dart';
import 'wishlist_state.dart';

class WishlistBloc extends Bloc<WishlistEvent, WishlistState> {
  final WishlistRepository _wishlistRepository;

  WishlistBloc({required WishlistRepository wishlistRepository})
      : _wishlistRepository = wishlistRepository,
        super(WishlistInitial()) {
    on<LoadWishlist>(_onLoadWishlist);
    on<AddToWishlist>(_onAddToWishlist);
    on<RemoveFromWishlist>(_onRemoveFromWishlist);
  }

  Future<void> _onLoadWishlist(LoadWishlist event, Emitter<WishlistState> emit) async {
    emit(WishlistLoading());
    final result = await _wishlistRepository.getWishlist();
    result.fold(
      (failure) => emit(WishlistError(message: failure.message)),
      (items) {
        final wishlistItems = (items as List)
            .map((item) => WishlistItem.fromJson(item as Map<String, dynamic>))
            .toList();
        emit(WishlistLoaded(items: wishlistItems));
      },
    );
  }

  Future<void> _onAddToWishlist(AddToWishlist event, Emitter<WishlistState> emit) async {
    final result = await _wishlistRepository.addToWishlist(event.productId);
    result.fold(
      (failure) => emit(WishlistError(message: failure.message)),
      (_) => add(const LoadWishlist()),
    );
  }

  Future<void> _onRemoveFromWishlist(RemoveFromWishlist event, Emitter<WishlistState> emit) async {
    final result = await _wishlistRepository.removeFromWishlist(event.productId);
    result.fold(
      (failure) => emit(WishlistError(message: failure.message)),
      (_) => add(const LoadWishlist()),
    );
  }
}

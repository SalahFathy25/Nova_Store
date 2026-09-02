import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nova_core/nova_core.dart';
import 'cart_event.dart';
import 'cart_state.dart';

class CartBloc extends Bloc<CartEvent, CartState> {
  final CartRepository _cartRepository;

  CartBloc({required CartRepository cartRepository})
      : _cartRepository = cartRepository,
        super(CartInitial()) {
    on<LoadCart>(_onLoadCart);
    on<AddToCart>(_onAddToCart);
    on<UpdateCartItem>(_onUpdateCartItem);
    on<RemoveFromCart>(_onRemoveFromCart);
    on<ClearCart>(_onClearCart);
  }

  Future<void> _onLoadCart(LoadCart event, Emitter<CartState> emit) async {
    emit(CartLoading());
    final result = await _cartRepository.getCart();
    result.fold(
      (failure) => emit(CartError(message: failure.message)),
      (cart) => emit(CartLoaded(cart: cart)),
    );
  }

  Future<void> _onAddToCart(AddToCart event, Emitter<CartState> emit) async {
    final result = await _cartRepository.addToCart(
      productId: event.productId,
      variantId: event.variantId,
      quantity: event.quantity,
    );
    result.fold(
      (failure) => emit(CartError(message: failure.message)),
      (_) => add(const LoadCart()),
    );
  }

  Future<void> _onUpdateCartItem(UpdateCartItem event, Emitter<CartState> emit) async {
    final result = await _cartRepository.updateCartItem(event.itemId, event.quantity);
    result.fold(
      (failure) => emit(CartError(message: failure.message)),
      (_) => add(const LoadCart()),
    );
  }

  Future<void> _onRemoveFromCart(RemoveFromCart event, Emitter<CartState> emit) async {
    final result = await _cartRepository.removeCartItem(event.itemId);
    result.fold(
      (failure) => emit(CartError(message: failure.message)),
      (_) => add(const LoadCart()),
    );
  }

  Future<void> _onClearCart(ClearCart event, Emitter<CartState> emit) async {
    final result = await _cartRepository.clearCart();
    result.fold(
      (failure) => emit(CartError(message: failure.message)),
      (_) => add(const LoadCart()),
    );
  }
}

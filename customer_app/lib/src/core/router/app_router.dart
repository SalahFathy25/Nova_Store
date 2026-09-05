import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../app/main_shell.dart';
import '../../features/auth/pages/login_page.dart';
import '../../features/auth/pages/register_page.dart';
import '../../features/auth/pages/otp_page.dart';
import '../../features/auth/pages/phone_input_page.dart';
import '../../features/auth/pages/forgot_password_page.dart';
import '../../features/products/pages/product_list_page.dart';
import '../../features/products/pages/product_detail_page.dart';
import '../../features/cart/pages/cart_page.dart';
import '../../features/profile/pages/profile_page.dart';
import '../../features/profile/pages/edit_profile_page.dart';
import '../../features/orders/pages/order_list_page.dart';
import '../../features/orders/pages/order_detail_page.dart';
import '../../features/wishlist/pages/wishlist_page.dart';
import '../../features/notifications/pages/notifications_page.dart';
import '../../features/reviews/bloc/review_bloc.dart';
import '../../features/categories/pages/category_page.dart';
import '../../features/search/pages/search_page.dart';
import '../../features/checkout/pages/checkout_page.dart';
import '../../features/checkout/pages/address_form_page.dart';
import '../../features/checkout/pages/order_confirmation_page.dart';
import '../../features/reviews/pages/reviews_list_page.dart';
import '../di/injection.dart';
import '../../features/products/bloc/product_bloc.dart';
import '../../features/orders/bloc/order_bloc.dart';
import '../../features/addresses/bloc/address_bloc.dart';
import '../../features/addresses/bloc/address_event.dart';

class AppRouter {
  static const String root = '/';
  static const String login = '/login';
  static const String register = '/register';
  static const String phoneInput = '/phone-input';
  static const String otp = '/otp';
  static const String search = '/search';
  static const String categories = '/categories';
  static const String productList = '/product-list';
  static const String productDetail = '/product-detail';
  static const String cart = '/cart';
  static const String checkout = '/checkout';
  static const String addressForm = '/checkout/address-form';
  static const String orderConfirmation = '/checkout/confirmation';
  static const String orders = '/orders';
  static const String orderDetail = '/orders/:id';
  static const String profile = '/profile';
  static const String editProfile = '/profile/edit';
  static const String wishlist = '/wishlist';
  static const String notifications = '/notifications';
  static const String forgotPassword = '/forgot-password';
  static const String reviewsList = '/reviews';

  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case root:
        return MaterialPageRoute(builder: (_) => const MainShell());

      case login:
        return MaterialPageRoute(builder: (_) => const LoginPage());

      case register:
        return MaterialPageRoute(builder: (_) => const RegisterPage());

      case phoneInput:
        return MaterialPageRoute(builder: (_) => const PhoneInputPage());

      case otp:
        final args = settings.arguments as String? ?? '';
        return MaterialPageRoute(builder: (_) => OtpPage(phone: args));

      case forgotPassword:
        return MaterialPageRoute(builder: (_) => const ForgotPasswordPage());

      case reviewsList:
        final args = settings.arguments as Map<String, dynamic>?;
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => getIt<ReviewBloc>(),
            child: ReviewsListPage(
              productId: args?['productId'] as String? ?? '',
              productName: args?['productName'] as String? ?? '',
            ),
          ),
        );

      case search:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => getIt<ProductBloc>(),
            child: const SearchPage(),
          ),
        );

      case categories:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => getIt<ProductBloc>(),
            child: const CategoryPage(),
          ),
        );

      case productList:
        final args = settings.arguments as Map<String, dynamic>?;
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => getIt<ProductBloc>(),
            child: ProductListPage(
              categoryId: args?['categoryId'] as String?,
              categoryName: args?['categoryName'] as String?,
              brandId: args?['brandId'] as String?,
              brandName: args?['brandName'] as String?,
              searchQuery: args?['searchQuery'] as String?,
            ),
          ),
        );

      case productDetail:
        final product = settings.arguments;
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => getIt<ReviewBloc>(),
            child: ProductDetailPage(product: product as dynamic),
          ),
        );

      case cart:
        return MaterialPageRoute(builder: (_) => const CartPage());

      case checkout:
        return MaterialPageRoute(
          builder: (_) => MultiBlocProvider(
            providers: [
              BlocProvider(create: (_) => getIt<AddressBloc>()..add(const LoadAddresses())),
              BlocProvider(create: (_) => getIt<OrderBloc>()),
            ],
            child: const CheckoutPage(),
          ),
        );

      case addressForm:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => getIt<AddressBloc>(),
            child: const AddressFormPage(),
          ),
        );

      case orderConfirmation:
        final args = settings.arguments as Map<String, dynamic>?;
        return MaterialPageRoute(
          builder: (_) => OrderConfirmationPage(
            orderNumber: args?['orderNumber'] as String? ?? '',
          ),
        );

      case orders:
        return MaterialPageRoute(builder: (_) => const OrderListPage());

      case profile:
        return MaterialPageRoute(builder: (_) => const ProfilePage());

      case editProfile:
        return MaterialPageRoute(builder: (_) => const EditProfilePage());

      case wishlist:
        return MaterialPageRoute(builder: (_) => const WishlistPage());

      case notifications:
        return MaterialPageRoute(builder: (_) => const NotificationsPage());

      default:
        final uri = Uri.parse(settings.name ?? '');

        if (uri.pathSegments.length == 2 && uri.pathSegments[0] == 'orders') {
          final order = settings.arguments;
          return MaterialPageRoute(
            builder: (_) => OrderDetailPage(order: order as dynamic),
          );
        }

        return MaterialPageRoute(builder: (_) => const MainShell());
    }
  }
}

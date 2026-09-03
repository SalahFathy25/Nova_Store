class ApiConstants {
  ApiConstants._();

  // Base URLs
  // For production: https://nova-store-production-03ac.up.railway.app
  // For development: http://192.168.1.5:3000
  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://nova-store-production-03ac.up.railway.app',
  );
  static const String apiVersion = '/api/v1';
  static const String defaultTenantId = 'a0000000-0000-0000-0000-000000000001';

  // Auth endpoints
  static const String login = '$apiVersion/auth/login';
  static const String register = '$apiVersion/auth/register';
  static const String refreshToken = '$apiVersion/auth/refresh-token';
  static const String sendOtp = '$apiVersion/auth/otp/send';
  static const String verifyOtp = '$apiVersion/auth/otp/verify';
  static const String forgotPassword = '$apiVersion/auth/forgot-password';
  static const String resetPassword = '$apiVersion/auth/reset-password';
  static const String profile = '$apiVersion/auth/me';

  // Product endpoints
  static const String products = '$apiVersion/products';
  static const String categories = '$apiVersion/categories';
  static const String brands = '$apiVersion/brands';

  // Marketing endpoints
  static const String home = '$apiVersion/home';
  static const String banners = '$apiVersion/banners';
  static const String flashSales = '$apiVersion/flash-sales';

  // Cart endpoints
  static const String cart = '$apiVersion/cart';
  static const String cartItems = '$apiVersion/cart/items';

  // Wishlist endpoints
  static const String wishlist = '$apiVersion/wishlist';

  // Order endpoints
  static const String orders = '$apiVersion/orders';

  // Address endpoints
  static const String addresses = '$apiVersion/addresses';

  // Coupon endpoints
  static const String coupons = '$apiVersion/coupons';

  // Notification endpoints
  static const String notifications = '$apiVersion/notifications';

  // App Config endpoint
  static const String appConfig = '$apiVersion/app-config';

  // Delivery endpoints
  static const String delivery = '$apiVersion/delivery';

  // Headers
  static const String tenantIdHeader = 'X-Tenant-ID';
  static const String authorizationHeader = 'Authorization';
  static const String contentTypeHeader = 'Content-Type';

  // SharedPreferences Keys
  static const String accessTokenKey = 'access_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String tenantIdKey = 'tenant_id';
  static const String userIdKey = 'user_id';
}

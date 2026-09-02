class AppConfig {
  final StoreConfig store;
  final BrandingConfig branding;
  final AuthConfig auth;
  final TextsConfig texts;
  final FeaturesConfig features;

  const AppConfig({
    required this.store,
    required this.branding,
    required this.auth,
    required this.texts,
    required this.features,
  });

  factory AppConfig.fromJson(Map<String, dynamic> json) {
    return AppConfig(
      store: StoreConfig.fromJson(json['store'] ?? {}),
      branding: BrandingConfig.fromJson(json['branding'] ?? {}),
      auth: AuthConfig.fromJson(json['auth'] ?? {}),
      texts: TextsConfig.fromJson(json['texts'] ?? {}),
      features: FeaturesConfig.fromJson(json['features'] ?? {}),
    );
  }

  static const empty = AppConfig(
    store: StoreConfig(id: '', name: 'NOVA', domain: ''),
    branding: BrandingConfig(),
    auth: AuthConfig(),
    texts: TextsConfig(),
    features: FeaturesConfig(),
  );
}

class StoreConfig {
  final String id;
  final String name;
  final String domain;

  const StoreConfig({
    required this.id,
    required this.name,
    required this.domain,
  });

  factory StoreConfig.fromJson(Map<String, dynamic> json) {
    return StoreConfig(
      id: json['id'] ?? '',
      name: json['name'] ?? 'NOVA',
      domain: json['domain'] ?? '',
    );
  }
}

class BrandingConfig {
  final String primaryColor;
  final String secondaryColor;
  final String fontFamily;
  final String? logoUrl;
  final String? splashBackground;

  const BrandingConfig({
    this.primaryColor = '#1A1A1A',
    this.secondaryColor = '#D4AF37',
    this.fontFamily = 'Cairo',
    this.logoUrl,
    this.splashBackground,
  });

  factory BrandingConfig.fromJson(Map<String, dynamic> json) {
    return BrandingConfig(
      primaryColor: json['primary_color'] ?? '#1A1A1A',
      secondaryColor: json['secondary_color'] ?? '#D4AF37',
      fontFamily: json['font_family'] ?? 'Cairo',
      logoUrl: json['logo_url'],
      splashBackground: json['splash_background'],
    );
  }
}

class AuthConfig {
  final bool emailEnabled;
  final bool phoneEnabled;
  final bool otpEnabled;
  final bool googleLoginEnabled;
  final bool appleLoginEnabled;
  final bool facebookLoginEnabled;
  final int passwordMinLength;
  final bool requireEmailVerification;

  const AuthConfig({
    this.emailEnabled = true,
    this.phoneEnabled = true,
    this.otpEnabled = true,
    this.googleLoginEnabled = false,
    this.appleLoginEnabled = false,
    this.facebookLoginEnabled = false,
    this.passwordMinLength = 8,
    this.requireEmailVerification = false,
  });

  factory AuthConfig.fromJson(Map<String, dynamic> json) {
    return AuthConfig(
      emailEnabled: json['email_enabled'] ?? true,
      phoneEnabled: json['phone_enabled'] ?? true,
      otpEnabled: json['otp_enabled'] ?? true,
      googleLoginEnabled: json['google_login_enabled'] ?? false,
      appleLoginEnabled: json['apple_login_enabled'] ?? false,
      facebookLoginEnabled: json['facebook_login_enabled'] ?? false,
      passwordMinLength: json['password_min_length'] ?? 8,
      requireEmailVerification: json['require_email_verification'] ?? false,
    );
  }

  bool get hasSocialLogin => googleLoginEnabled || appleLoginEnabled || facebookLoginEnabled;
  bool get hasAnyLogin => emailEnabled || phoneEnabled || hasSocialLogin;
}

class TextsConfig {
  final String appName;
  final String tagline;
  final String loginTitle;
  final String loginSubtitle;
  final String registerTitle;
  final String registerSubtitle;
  final String otpTitle;
  final String otpSubtitle;

  const TextsConfig({
    this.appName = 'NOVA Commerce',
    this.tagline = 'Your premium shopping destination',
    this.loginTitle = 'Welcome Back',
    this.loginSubtitle = 'Sign in to continue shopping',
    this.registerTitle = 'Create Account',
    this.registerSubtitle = 'Join us and start shopping',
    this.otpTitle = 'Verify Your Phone',
    this.otpSubtitle = 'Enter the code sent to your phone',
  });

  factory TextsConfig.fromJson(Map<String, dynamic> json) {
    return TextsConfig(
      appName: json['app_name'] ?? 'NOVA Commerce',
      tagline: json['tagline'] ?? 'Your premium shopping destination',
      loginTitle: json['login_title'] ?? 'Welcome Back',
      loginSubtitle: json['login_subtitle'] ?? 'Sign in to continue shopping',
      registerTitle: json['register_title'] ?? 'Create Account',
      registerSubtitle: json['register_subtitle'] ?? 'Join us and start shopping',
      otpTitle: json['otp_title'] ?? 'Verify Your Phone',
      otpSubtitle: json['otp_subtitle'] ?? 'Enter the code sent to your phone',
    );
  }
}

class FeaturesConfig {
  final String currency;
  final String locale;
  final double taxRate;
  final bool darkModeEnabled;
  final bool languageSwitcherEnabled;
  final bool returnsEnabled;
  final bool loyaltyProgramEnabled;

  const FeaturesConfig({
    this.currency = 'EGP',
    this.locale = 'ar',
    this.taxRate = 0.14,
    this.darkModeEnabled = false,
    this.languageSwitcherEnabled = true,
    this.returnsEnabled = true,
    this.loyaltyProgramEnabled = false,
  });

  factory FeaturesConfig.fromJson(Map<String, dynamic> json) {
    return FeaturesConfig(
      currency: json['currency'] ?? 'EGP',
      locale: json['locale'] ?? 'ar',
      taxRate: (json['tax_rate'] ?? 0.14).toDouble(),
      darkModeEnabled: json['dark_mode_enabled'] ?? false,
      languageSwitcherEnabled: json['language_switcher_enabled'] ?? true,
      returnsEnabled: json['returns_enabled'] ?? true,
      loyaltyProgramEnabled: json['loyalty_program_enabled'] ?? false,
    );
  }
}

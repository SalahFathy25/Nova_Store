import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nova_core/nova_core.dart';
import '../bloc/auth_bloc.dart';
import '../bloc/auth_event.dart';
import '../bloc/auth_state.dart';
import '../../app_config/app_config_cubit.dart';
import '../../app_config/app_config_state.dart';
import '../../../core/router/app_router.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  late final AnimationController _animController;
  late final Animation<double> _fadeAnim;
  late final Animation<Offset> _slideAnim;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    );
    _fadeAnim = CurvedAnimation(parent: _animController, curve: Curves.easeOut);
    _slideAnim = Tween<Offset>(
      begin: const Offset(0, 0.15),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _animController, curve: Curves.easeOutCubic));
    _animController.forward();
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _animController.dispose();
    super.dispose();
  }

  Color _parseColor(String hex) {
    return Color(int.parse(hex.replaceFirst('#', '0xFF')));
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AppConfigCubit, AppConfigState>(
      builder: (context, configState) {
        final config = configState is AppConfigLoaded
            ? configState.config
            : AppConfig.empty;
        final texts = config.texts;
        final branding = config.branding;
        final auth = config.auth;

        final secondaryColor = _parseColor(branding.secondaryColor);
        final primaryColor = _parseColor(branding.primaryColor);

        return Scaffold(
          backgroundColor: NovaTheme.backgroundColor,
          body: BlocListener<AuthBloc, AuthState>(
            listener: (context, state) {
              if (state is AuthAuthenticated) {
                Navigator.of(context).pushReplacementNamed(AppRouter.root);
              } else if (state is AuthError) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(state.message),
                    backgroundColor: NovaTheme.errorColor,
                    behavior: SnackBarBehavior.floating,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    margin: const EdgeInsets.all(16),
                  ),
                );
              }
            },
            child: FadeTransition(
              opacity: _fadeAnim,
              child: Column(
                children: [
                  _buildHero(context, texts, branding, secondaryColor, primaryColor),
                  Expanded(
                    child: SlideTransition(
                      position: _slideAnim,
                      child: SingleChildScrollView(
                        padding: const EdgeInsets.symmetric(horizontal: 28),
                        child: Form(
                          key: _formKey,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              const SizedBox(height: 32),
                              Text(
                                texts.loginTitle,
                                style: NovaTheme.headingLarge.copyWith(
                                  fontSize: 26,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                texts.loginSubtitle,
                                style: NovaTheme.bodyMedium.copyWith(
                                  color: NovaTheme.textSecondary,
                                ),
                              ),
                              const SizedBox(height: 28),

                              if (auth.emailEnabled) ...[
                                _buildTextField(
                                  controller: _emailController,
                                  label: 'Email Address',
                                  hint: 'you@example.com',
                                  icon: Icons.mail_outline_rounded,
                                  keyboardType: TextInputType.emailAddress,
                                  textInputAction: TextInputAction.next,
                                  focusColor: secondaryColor,
                                  validator: (v) {
                                    if (v == null || v.isEmpty) return 'Enter your email';
                                    if (!v.contains('@')) return 'Invalid email';
                                    return null;
                                  },
                                ),
                                const SizedBox(height: 16),

                                _buildTextField(
                                  controller: _passwordController,
                                  label: 'Password',
                                  hint: 'Enter password',
                                  icon: Icons.lock_outline_rounded,
                                  obscure: _obscurePassword,
                                  keyboardType: TextInputType.visiblePassword,
                                  textInputAction: TextInputAction.done,
                                  focusColor: secondaryColor,
                                  suffixIcon: IconButton(
                                    icon: Icon(
                                      _obscurePassword
                                          ? Icons.visibility_off_rounded
                                          : Icons.visibility_rounded,
                                      size: 20,
                                      color: NovaTheme.grey500,
                                    ),
                                    onPressed: () =>
                                        setState(() => _obscurePassword = !_obscurePassword),
                                  ),
                                  validator: (v) {
                                    if (v == null || v.isEmpty) return 'Enter your password';
                                    if (v.length < auth.passwordMinLength) {
                                      return 'Min ${auth.passwordMinLength} characters';
                                    }
                                    return null;
                                  },
                                ),
                                const SizedBox(height: 12),

                                Align(
                                  alignment: Alignment.centerRight,
                                  child: TextButton(
                                    onPressed: () {
                                      Navigator.pushNamed(context, '/forgot-password');
                                    },
                                    style: TextButton.styleFrom(
                                      padding: EdgeInsets.zero,
                                      minimumSize: Size.zero,
                                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                    ),
                                    child: Text(
                                      'Forgot Password?',
                                      style: NovaTheme.bodySmall.copyWith(
                                        color: secondaryColor,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 24),

                                BlocBuilder<AuthBloc, AuthState>(
                                  builder: (context, state) {
                                    return SizedBox(
                                      height: 54,
                                      child: ElevatedButton(
                                        onPressed: state is AuthLoading
                                            ? null
                                            : () {
                                                if (_formKey.currentState!.validate()) {
                                                  context.read<AuthBloc>().add(AuthLogin(
                                                        email: _emailController.text.trim(),
                                                        password: _passwordController.text,
                                                      ));
                                                }
                                              },
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: primaryColor,
                                          foregroundColor: Colors.white,
                                          disabledBackgroundColor: NovaTheme.grey300,
                                          shape: RoundedRectangleBorder(
                                            borderRadius: BorderRadius.circular(14),
                                          ),
                                          elevation: 0,
                                        ),
                                        child: state is AuthLoading
                                            ? const SizedBox(
                                                height: 22,
                                                width: 22,
                                                child: CircularProgressIndicator(
                                                  strokeWidth: 2.5,
                                                  color: Colors.white,
                                                ),
                                              )
                                            : const Text(
                                                'Sign In',
                                                style: TextStyle(
                                                  fontSize: 16,
                                                  fontWeight: FontWeight.w700,
                                                  letterSpacing: 0.5,
                                                ),
                                              ),
                                      ),
                                    );
                                  },
                                ),
                              ],

                              if (auth.emailEnabled && auth.phoneEnabled) ...[
                                const SizedBox(height: 20),
                                _buildDivider(),
                                const SizedBox(height: 20),
                              ],

                              if (auth.phoneEnabled) ...[
                                SizedBox(
                                  height: 54,
                                  child: OutlinedButton(
                                    onPressed: () =>
                                        Navigator.pushNamed(context, AppRouter.phoneInput),
                                    style: OutlinedButton.styleFrom(
                                      foregroundColor: primaryColor,
                                      side: const BorderSide(
                                          color: NovaTheme.grey300, width: 1.5),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(14),
                                      ),
                                    ),
                                    child: const Row(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Icon(Icons.phone_rounded, size: 20),
                                        SizedBox(width: 10),
                                        Text(
                                          'Continue with Phone',
                                          style: TextStyle(
                                            fontSize: 15,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ],

                              const SizedBox(height: 28),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    "Don't have an account? ",
                                    style: NovaTheme.bodyMedium.copyWith(
                                      color: NovaTheme.textSecondary,
                                    ),
                                  ),
                                  GestureDetector(
                                    onTap: () =>
                                        Navigator.pushNamed(context, AppRouter.register),
                                    child: Text(
                                      'Sign Up',
                                      style: NovaTheme.bodyMedium.copyWith(
                                        color: secondaryColor,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 32),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildHero(
    BuildContext context,
    TextsConfig texts,
    BrandingConfig branding,
    Color secondaryColor,
    Color primaryColor,
  ) {
    final size = MediaQuery.of(context).size;
    final topPadding = MediaQuery.of(context).padding.top;

    return Container(
      width: double.infinity,
      height: size.height * 0.38 + topPadding,
      padding: EdgeInsets.only(top: topPadding),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            primaryColor.withOpacity(0.9),
            primaryColor,
            secondaryColor.withOpacity(0.15),
          ],
        ),
      ),
      child: Stack(
        children: [
          Positioned(
            top: -60,
            right: -40,
            child: Container(
              width: 200,
              height: 200,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: secondaryColor.withOpacity(0.12),
                  width: 1.5,
                ),
              ),
            ),
          ),
          Positioned(
            top: 30,
            right: 20,
            child: Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: secondaryColor.withOpacity(0.08),
                  width: 1,
                ),
              ),
            ),
          ),
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              height: 3,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Colors.transparent,
                    secondaryColor,
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),
          Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 72,
                  height: 72,
                  decoration: BoxDecoration(
                    color: secondaryColor.withOpacity(0.1),
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: secondaryColor.withOpacity(0.3),
                      width: 1.5,
                    ),
                  ),
                  child: branding.logoUrl != null
                      ? ClipOval(
                          child: Image.network(
                            branding.logoUrl!,
                            width: 72,
                            height: 72,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => Icon(
                              Icons.storefront_rounded,
                              size: 36,
                              color: secondaryColor,
                            ),
                          ),
                        )
                      : Icon(
                          Icons.storefront_rounded,
                          size: 36,
                          color: secondaryColor,
                        ),
                ),
                const SizedBox(height: 16),
                Text(
                  texts.appName.toUpperCase(),
                  style: const TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                    letterSpacing: 6,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  texts.tagline,
                  style: TextStyle(
                    fontSize: 13,
                    color: Colors.white.withOpacity(0.6),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDivider() {
    return Row(
      children: [
        const Expanded(child: Divider(color: NovaTheme.grey300)),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14),
          child: Text(
            'OR',
            style: NovaTheme.bodySmall.copyWith(
              fontWeight: FontWeight.w600,
              letterSpacing: 1,
            ),
          ),
        ),
        const Expanded(child: Divider(color: NovaTheme.grey300)),
      ],
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icon,
    Color focusColor = NovaTheme.secondaryColor,
    TextInputType? keyboardType,
    TextInputAction? textInputAction,
    bool obscure = false,
    Widget? suffixIcon,
    String? Function(String?)? validator,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: NovaTheme.labelLarge.copyWith(fontSize: 13, color: NovaTheme.grey700),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          keyboardType: keyboardType,
          textInputAction: textInputAction,
          obscureText: obscure,
          validator: validator,
          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w500),
          decoration: InputDecoration(
            hintText: hint,
            prefixIcon: Icon(icon, size: 20, color: NovaTheme.grey500),
            suffixIcon: suffixIcon,
            filled: true,
            fillColor: Colors.white,
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: NovaTheme.grey200),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: NovaTheme.grey200),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: focusColor, width: 1.5),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: NovaTheme.errorColor),
            ),
          ),
        ),
      ],
    );
  }
}

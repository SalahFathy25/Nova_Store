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

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _obscurePassword = true;
  bool _obscureConfirm = true;
  late final AnimationController _animController;
  late final Animation<double> _fadeAnim;

  bool _hasMinLength = false;
  bool _hasUppercase = false;
  bool _hasLowercase = false;
  bool _hasNumber = false;
  bool _passwordsMatch = false;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _fadeAnim = CurvedAnimation(parent: _animController, curve: Curves.easeOut);
    _animController.forward();
    _passwordController.addListener(_checkPasswordRules);
    _confirmPasswordController.addListener(_checkPasswordMatch);
  }

  @override
  void dispose() {
    _animController.dispose();
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _checkPasswordRules() {
    final password = _passwordController.text;
    final state = context.read<AppConfigCubit>().state;
    if (state is! AppConfigLoaded) return;
    final auth = state.config.auth;
    setState(() {
      _hasMinLength = password.length >= auth.passwordMinLength;
      _hasUppercase = password.contains(RegExp(r'[A-Z]'));
      _hasLowercase = password.contains(RegExp(r'[a-z]'));
      _hasNumber = password.contains(RegExp(r'[0-9]'));
    });
  }

  void _checkPasswordMatch() {
    setState(() {
      _passwordsMatch = _confirmPasswordController.text.isNotEmpty &&
          _confirmPasswordController.text == _passwordController.text;
    });
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
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.symmetric(horizontal: 28),
                      child: Form(
                        key: _formKey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            const SizedBox(height: 28),
                            Text(
                              texts.registerTitle,
                              style: NovaTheme.headingLarge.copyWith(
                                fontSize: 26,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              texts.registerSubtitle,
                              style: NovaTheme.bodyMedium.copyWith(
                                color: NovaTheme.textSecondary,
                              ),
                            ),
                            const SizedBox(height: 24),

                            _buildTextField(
                              controller: _nameController,
                              label: 'Full Name',
                              hint: 'John Doe',
                              icon: Icons.person_outline_rounded,
                              keyboardType: TextInputType.name,
                              textInputAction: TextInputAction.next,
                              focusColor: secondaryColor,
                              validator: (v) {
                                if (v == null || v.isEmpty) return 'Enter your name';
                                return null;
                              },
                            ),
                            const SizedBox(height: 14),

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
                              const SizedBox(height: 14),
                            ],

                            _buildTextField(
                              controller: _passwordController,
                              label: 'Password',
                              hint: 'Min ${auth.passwordMinLength} characters',
                              icon: Icons.lock_outline_rounded,
                              obscure: _obscurePassword,
                              keyboardType: TextInputType.visiblePassword,
                              textInputAction: TextInputAction.next,
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
                                if (v == null || v.isEmpty) return 'Enter a password';
                                if (v.length < auth.passwordMinLength) {
                                  return 'Min ${auth.passwordMinLength} characters';
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 8),
                            _buildPasswordRules(auth),
                            const SizedBox(height: 14),

                            _buildTextField(
                              controller: _confirmPasswordController,
                              label: 'Confirm Password',
                              hint: 'Re-enter password',
                              icon: Icons.lock_outline_rounded,
                              obscure: _obscureConfirm,
                              keyboardType: TextInputType.visiblePassword,
                              textInputAction: TextInputAction.done,
                              focusColor: secondaryColor,
                              suffixIcon: IconButton(
                                icon: Icon(
                                  _obscureConfirm
                                      ? Icons.visibility_off_rounded
                                      : Icons.visibility_rounded,
                                  size: 20,
                                  color: NovaTheme.grey500,
                                ),
                                onPressed: () =>
                                    setState(() => _obscureConfirm = !_obscureConfirm),
                              ),
                              validator: (v) {
                                if (v != _passwordController.text) {
                                  return "Passwords don't match";
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 8),
                            _buildConfirmRule(),
                            const SizedBox(height: 28),

                            BlocBuilder<AuthBloc, AuthState>(
                              builder: (context, state) {
                                return SizedBox(
                                  height: 54,
                                  child: ElevatedButton(
                                    onPressed: state is AuthLoading
                                        ? null
                                        : () {
                                            if (_formKey.currentState!.validate()) {
                                              context.read<AuthBloc>().add(AuthRegister(
                                                    fullName: _nameController.text.trim(),
                                                    email: auth.emailEnabled
                                                        ? _emailController.text.trim()
                                                        : '',
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
                                            'Create Account',
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
                            const SizedBox(height: 24),

                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  'Already have an account? ',
                                  style: NovaTheme.bodyMedium.copyWith(
                                    color: NovaTheme.textSecondary,
                                  ),
                                ),
                                GestureDetector(
                                  onTap: () => Navigator.pop(context),
                                  child: Text(
                                    'Sign In',
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
      height: size.height * 0.30 + topPadding,
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
            top: -80,
            left: -50,
            child: Container(
              width: 220,
              height: 220,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: secondaryColor.withOpacity(0.1),
                  width: 1.5,
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
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    color: secondaryColor.withOpacity(0.1),
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: secondaryColor.withOpacity(0.3),
                      width: 1.5,
                    ),
                  ),
                  child: Icon(
                    Icons.person_add_rounded,
                    size: 30,
                    color: secondaryColor,
                  ),
                ),
                const SizedBox(height: 14),
                Text(
                  texts.registerTitle.toUpperCase(),
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                    letterSpacing: 4,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  texts.registerSubtitle,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.white.withOpacity(0.5),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPasswordRules(AuthConfig auth) {
    final rules = [
      _PasswordRule(text: 'Min ${auth.passwordMinLength} characters', met: _hasMinLength),
      _PasswordRule(text: 'One uppercase letter', met: _hasUppercase),
      _PasswordRule(text: 'One lowercase letter', met: _hasLowercase),
      _PasswordRule(text: 'One number', met: _hasNumber),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: rules.map((rule) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 4),
          child: Row(
            children: [
              Icon(
                rule.met ? Icons.check_circle_rounded : Icons.circle_outlined,
                size: 14,
                color: rule.met ? const Color(0xFF2ECC71) : NovaTheme.grey400,
              ),
              const SizedBox(width: 8),
              Text(
                rule.text,
                style: TextStyle(
                  fontSize: 12,
                  color: rule.met ? const Color(0xFF2ECC71) : NovaTheme.grey500,
                  fontWeight: rule.met ? FontWeight.w600 : FontWeight.normal,
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildConfirmRule() {
    if (_confirmPasswordController.text.isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        children: [
          Icon(
            _passwordsMatch ? Icons.check_circle_rounded : Icons.cancel_rounded,
            size: 14,
            color: _passwordsMatch ? const Color(0xFF2ECC71) : NovaTheme.errorColor,
          ),
          const SizedBox(width: 8),
          Text(
            _passwordsMatch ? 'Passwords match' : "Passwords don't match",
            style: TextStyle(
              fontSize: 12,
              color: _passwordsMatch ? const Color(0xFF2ECC71) : NovaTheme.errorColor,
              fontWeight: _passwordsMatch ? FontWeight.w600 : FontWeight.normal,
            ),
          ),
        ],
      ),
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

class _PasswordRule {
  final String text;
  final bool met;
  const _PasswordRule({required this.text, required this.met});
}

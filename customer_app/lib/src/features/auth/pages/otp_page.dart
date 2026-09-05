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

class OtpPage extends StatefulWidget {
  final String phone;

  const OtpPage({super.key, required this.phone});

  @override
  State<OtpPage> createState() => _OtpPageState();
}

class _OtpPageState extends State<OtpPage> with SingleTickerProviderStateMixin {
  final List<TextEditingController> _controllers = List.generate(
    6,
    (index) => TextEditingController(),
  );
  final List<FocusNode> _focusNodes = List.generate(
    6,
    (index) => FocusNode(),
  );
  late final AnimationController _animController;
  late final Animation<double> _fadeAnim;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _fadeAnim = CurvedAnimation(parent: _animController, curve: Curves.easeOut);
    _animController.forward();
  }

  @override
  void dispose() {
    for (final c in _controllers) {
      c.dispose();
    }
    for (final f in _focusNodes) {
      f.dispose();
    }
    _animController.dispose();
    super.dispose();
  }

  void _verifyOtp() {
    final otp = _controllers.map((c) => c.text).join();
    if (otp.length == 6) {
      context.read<AuthBloc>().add(AuthVerifyOtp(
            phone: widget.phone,
            code: otp,
          ));
    }
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
                  // ── Hero Section ──
                  _buildHero(context, texts, secondaryColor, primaryColor),

                  // ── OTP Section ──
                  Expanded(
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.symmetric(horizontal: 28),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          const SizedBox(height: 36),

                          // Phone number display
                          if (widget.phone.isNotEmpty) ...[
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.phone_rounded,
                                    size: 16, color: NovaTheme.grey500),
                                const SizedBox(width: 6),
                                Text(
                                  widget.phone,
                                  style: NovaTheme.bodyLarge.copyWith(
                                    fontWeight: FontWeight.w600,
                                    color: NovaTheme.textPrimary,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                          ],
                          Text(
                            texts.otpSubtitle,
                            textAlign: TextAlign.center,
                            style: NovaTheme.bodyMedium.copyWith(
                              color: NovaTheme.textSecondary,
                            ),
                          ),
                          const SizedBox(height: 32),

                          // OTP Input Boxes
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: List.generate(6, (index) {
                              return SizedBox(
                                width: 48,
                                height: 56,
                                child: Focus(
                                  focusNode: _focusNodes[index],
                                  onKeyEvent: (node, event) {
                                    if (event is KeyDownEvent &&
                                        event.logicalKey ==
                                            LogicalKeyboardKey.backspace &&
                                        _controllers[index].text.isEmpty &&
                                        index > 0) {
                                      _focusNodes[index - 1].requestFocus();
                                      _controllers[index - 1].clear();
                                      return KeyEventResult.handled;
                                    }
                                    return KeyEventResult.ignored;
                                  },
                                  child: TextFormField(
                                    controller: _controllers[index],
                                    focusNode: _focusNodes[index],
                                    textAlign: TextAlign.center,
                                    keyboardType: TextInputType.number,
                                    maxLength: 1,
                                    style: const TextStyle(
                                      fontSize: 24,
                                      fontWeight: FontWeight.w800,
                                    ),
                                    inputFormatters: [
                                      FilteringTextInputFormatter.digitsOnly,
                                    ],
                                    decoration: InputDecoration(
                                      counterText: '',
                                      filled: true,
                                      fillColor: Colors.white,
                                      contentPadding: EdgeInsets.zero,
                                      border: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(12),
                                        borderSide: const BorderSide(
                                          color: NovaTheme.grey300,
                                          width: 1.5,
                                        ),
                                      ),
                                      enabledBorder: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(12),
                                        borderSide: const BorderSide(
                                          color: NovaTheme.grey300,
                                          width: 1.5,
                                        ),
                                      ),
                                      focusedBorder: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(12),
                                        borderSide: BorderSide(
                                          color: secondaryColor,
                                          width: 2,
                                        ),
                                      ),
                                    ),
                                    onChanged: (value) {
                                      if (value.length == 1 && index < 5) {
                                        _focusNodes[index + 1].requestFocus();
                                      } else if (value.isEmpty && index > 0) {
                                        _focusNodes[index - 1].requestFocus();
                                      }
                                      if (index == 5 && value.isNotEmpty) {
                                        _verifyOtp();
                                      }
                                    },
                                  ),
                                ),
                              );
                            }),
                          ),
                          const SizedBox(height: 32),

                          // Verify button
                          BlocBuilder<AuthBloc, AuthState>(
                            builder: (context, state) {
                              return SizedBox(
                                height: 54,
                                child: ElevatedButton(
                                  onPressed: state is AuthLoading ? null : _verifyOtp,
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
                                          'Verify Code',
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

                          // Resend
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                "Didn't receive the code? ",
                                style: NovaTheme.bodyMedium.copyWith(
                                  color: NovaTheme.textSecondary,
                                ),
                              ),
                              GestureDetector(
                                onTap: () {
                                  context
                                      .read<AuthBloc>()
                                      .add(AuthSendOtp(phone: widget.phone));
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: const Text('Code resent!'),
                                      backgroundColor: NovaTheme.successColor,
                                      behavior: SnackBarBehavior.floating,
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                      margin: const EdgeInsets.all(16),
                                    ),
                                  );
                                },
                                child: Text(
                                  'Resend',
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
    Color secondaryColor,
    Color primaryColor,
  ) {
    final size = MediaQuery.of(context).size;
    final topPadding = MediaQuery.of(context).padding.top;

    return Container(
      width: double.infinity,
      height: size.height * 0.35 + topPadding,
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
                  child: Icon(
                    Icons.shield_rounded,
                    size: 34,
                    color: secondaryColor,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  texts.otpTitle.toUpperCase(),
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                    letterSpacing: 4,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  texts.tagline,
                  style: TextStyle(
                    fontSize: 13,
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
}

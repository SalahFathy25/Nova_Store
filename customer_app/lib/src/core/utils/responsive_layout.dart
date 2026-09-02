import 'package:flutter/material.dart';

class ResponsiveLayout {
  static const double mobileMaxWidth = 600;
  static const double tabletMaxWidth = 900;

  static bool isMobile(BuildContext context) =>
      MediaQuery.of(context).size.width < mobileMaxWidth;

  static bool isTablet(BuildContext context) =>
      MediaQuery.of(context).size.width >= mobileMaxWidth &&
      MediaQuery.of(context).size.width < tabletMaxWidth;

  static bool isDesktop(BuildContext context) =>
      MediaQuery.of(context).size.width >= tabletMaxWidth;

  static int gridCrossAxisCount(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (width >= tabletMaxWidth) return 4;
    if (width >= mobileMaxWidth) return 3;
    return 2;
  }

  static double horizontalPadding(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (width >= tabletMaxWidth) return 32;
    if (width >= mobileMaxWidth) return 24;
    return 16;
  }

  static Widget constrainWidth(BuildContext context, {required Widget child, double maxWidth = 600}) {
    return Center(
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: maxWidth),
        child: child,
      ),
    );
  }
}

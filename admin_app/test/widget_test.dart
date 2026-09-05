import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:admin_app/main.dart';

void main() {
  testWidgets('App renders', (WidgetTester tester) async {
    await tester.pumpWidget(const AdminApp());
    expect(find.text('NOVA Admin Dashboard - Coming Soon'), findsOneWidget);
  });
}

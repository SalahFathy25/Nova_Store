import 'package:flutter_test/flutter_test.dart';
import 'package:customer_app/src/app/app.dart';

void main() {
  testWidgets('App should render', (WidgetTester tester) async {
    await tester.pumpWidget(const CustomerApp());
    expect(find.text('NOVA Commerce'), findsOneWidget);
  });
}

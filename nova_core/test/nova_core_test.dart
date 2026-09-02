import 'package:flutter_test/flutter_test.dart';
import 'package:nova_core/nova_core.dart';

void main() {
  test('ApiConstants has correct base URL', () {
    expect(ApiConstants.baseUrl, 'http://localhost:3000');
  });
}

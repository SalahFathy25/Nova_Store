import 'package:dio/dio.dart';

class TenantInterceptor extends Interceptor {
  String _tenantId = '';

  void setTenantId(String tenantId) {
    _tenantId = tenantId;
  }

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    if (_tenantId.isNotEmpty) {
      options.headers['X-Tenant-ID'] = _tenantId;
    }
    handler.next(options);
  }
}

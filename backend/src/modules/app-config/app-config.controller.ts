import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { AppConfigService } from './app-config.service.js';

@ApiTags('App Config')
@ApiSecurity('tenant-id')
@Controller('api/v1/app-config')
export class AppConfigController {
  constructor(private readonly appConfigService: AppConfigService) {}

  @Get()
  @ApiOperation({ summary: 'Get app configuration for the current tenant' })
  async getConfig(@Req() req: any) {
    return this.appConfigService.getConfig(req.tenantId);
  }
}

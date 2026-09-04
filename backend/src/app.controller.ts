import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Root health check' })
  root() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'NOVA Commerce API',
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'NOVA Commerce API',
    };
  }
}

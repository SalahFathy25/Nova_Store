import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { MarketingService } from './marketing.service.js';
import { CurrentTenantId } from '../../common/decorators/tenant.decorator.js';

@ApiTags('Marketing / Home')
@Controller('api/v1')
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  @Get('home')
  @ApiOperation({ summary: 'Get home page sections with data' })
  @ApiResponse({ status: 200, description: 'Home sections retrieved successfully' })
  async getHomeSections(@CurrentTenantId() tenantId: string) {
    return this.marketingService.getHomeSections(tenantId);
  }

  @Get('banners')
  @ApiOperation({ summary: 'Get active banners' })
  @ApiQuery({ name: 'position', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Banners retrieved successfully' })
  async getBanners(
    @CurrentTenantId() tenantId: string,
    @Query('position') position?: string,
  ) {
    return this.marketingService.getBanners(tenantId, position);
  }

  @Get('flash-sales/current')
  @ApiOperation({ summary: 'Get current active flash sale with products' })
  @ApiResponse({ status: 200, description: 'Flash sale retrieved successfully' })
  async getFlashSale(@CurrentTenantId() tenantId: string) {
    return this.marketingService.getFlashSale(tenantId);
  }

  @Get('flash-sales/:id/products')
  @ApiOperation({ summary: 'Get products in a specific flash sale' })
  @ApiResponse({ status: 200, description: 'Flash sale products retrieved successfully' })
  async getFlashSaleProducts(
    @CurrentTenantId() tenantId: string,
    @Param('id') flashSaleId: string,
  ) {
    return this.marketingService.getFlashSaleProducts(tenantId, flashSaleId);
  }
}

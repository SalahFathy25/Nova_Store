import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BrandsService } from './brands.service.js';
import { CreateBrandDto, UpdateBrandDto } from './dto/brand.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CurrentTenantId } from '../../common/decorators/tenant.decorator.js';

@ApiTags('Brands')
@Controller('api/v1/brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all brands' })
  async findAll(@CurrentTenantId() tenantId: string) {
    return this.brandsService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get brand by ID' })
  async findOne(@Param('id') id: string, @CurrentTenantId() tenantId: string) {
    return this.brandsService.findOne(id, tenantId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a brand' })
  async create(@Body() dto: CreateBrandDto, @CurrentTenantId() tenantId: string) {
    return this.brandsService.create(dto, tenantId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a brand' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBrandDto,
    @CurrentTenantId() tenantId: string,
  ) {
    return this.brandsService.update(id, dto, tenantId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a brand' })
  async remove(@Param('id') id: string, @CurrentTenantId() tenantId: string) {
    await this.brandsService.remove(id, tenantId);
    return { message: 'Brand deleted successfully' };
  }
}

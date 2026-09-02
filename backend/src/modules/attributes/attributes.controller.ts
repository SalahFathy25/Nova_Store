import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AttributesService } from './attributes.service.js';
import { CreateAttributeDto, UpdateAttributeDto, CreateAttributeValueDto } from './dto/attribute.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CurrentTenantId } from '../../common/decorators/tenant.decorator.js';

@ApiTags('Attributes')
@Controller('api/v1/attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all attributes' })
  async findAll(@CurrentTenantId() tenantId: string) {
    return this.attributesService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attribute by ID' })
  async findOne(@Param('id') id: string, @CurrentTenantId() tenantId: string) {
    return this.attributesService.findOne(id, tenantId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an attribute' })
  async create(@Body() dto: CreateAttributeDto, @CurrentTenantId() tenantId: string) {
    return this.attributesService.create(dto, tenantId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an attribute' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAttributeDto,
    @CurrentTenantId() tenantId: string,
  ) {
    return this.attributesService.update(id, dto, tenantId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an attribute' })
  async remove(@Param('id') id: string, @CurrentTenantId() tenantId: string) {
    await this.attributesService.remove(id, tenantId);
    return { message: 'Attribute deleted successfully' };
  }

  @Post(':id/values')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add attribute value' })
  async addValue(
    @Param('id') id: string,
    @Body() dto: CreateAttributeValueDto,
    @CurrentTenantId() tenantId: string,
  ) {
    return this.attributesService.addValue(id, dto, tenantId);
  }

  @Delete('values/:valueId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove attribute value' })
  async removeValue(@Param('valueId') valueId: string) {
    await this.attributesService.removeValue(valueId);
    return { message: 'Attribute value deleted successfully' };
  }
}

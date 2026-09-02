import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CurrentTenantId } from '../../common/decorators/tenant.decorator.js';

@ApiTags('Categories')
@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  async findAll(@CurrentTenantId() tenantId: string) {
    return this.categoriesService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  async findOne(@Param('id') id: string, @CurrentTenantId() tenantId: string) {
    return this.categoriesService.findOne(id, tenantId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a category' })
  async create(@Body() dto: CreateCategoryDto, @CurrentTenantId() tenantId: string) {
    return this.categoriesService.create(dto, tenantId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a category' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @CurrentTenantId() tenantId: string,
  ) {
    return this.categoriesService.update(id, dto, tenantId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a category' })
  async remove(@Param('id') id: string, @CurrentTenantId() tenantId: string) {
    await this.categoriesService.remove(id, tenantId);
    return { message: 'Category deleted successfully' };
  }
}

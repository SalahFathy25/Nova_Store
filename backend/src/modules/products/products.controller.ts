import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service.js';
import { CreateProductDto, UpdateProductDto, CreateVariantDto } from './dto/product.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CurrentTenantId } from '../../common/decorators/tenant.decorator.js';

@ApiTags('Products')
@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'category_id', required: false, type: String })
  @ApiQuery({ name: 'brand_id', required: false, type: String })
  async findAll(
    @CurrentTenantId() tenantId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('category_id') categoryId?: string,
    @Query('brand_id') brandId?: string,
  ) {
    return this.productsService.findAll(
      tenantId,
      page || 1,
      limit || 20,
      search,
      categoryId,
      brandId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  async findOne(@Param('id') id: string, @CurrentTenantId() tenantId: string) {
    return this.productsService.findOne(id, tenantId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a product' })
  async create(@Body() dto: CreateProductDto, @CurrentTenantId() tenantId: string) {
    return this.productsService.create(dto, tenantId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @CurrentTenantId() tenantId: string,
  ) {
    return this.productsService.update(id, dto, tenantId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product' })
  async remove(@Param('id') id: string, @CurrentTenantId() tenantId: string) {
    await this.productsService.remove(id, tenantId);
    return { message: 'Product deleted successfully' };
  }

  @Post(':id/variants')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add product variant' })
  async addVariant(
    @Param('id') id: string,
    @Body() dto: CreateVariantDto,
    @CurrentTenantId() tenantId: string,
  ) {
    return this.productsService.addVariant(id, dto, tenantId);
  }

  @Put('variants/:variantId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product variant' })
  async updateVariant(
    @Param('variantId') variantId: string,
    @Body() dto: Partial<CreateVariantDto>,
  ) {
    return this.productsService.updateVariant(variantId, dto);
  }

  @Delete('variants/:variantId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product variant' })
  async removeVariant(@Param('variantId') variantId: string) {
    await this.productsService.removeVariant(variantId);
    return { message: 'Variant deleted successfully' };
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add product image' })
  async addImage(
    @Param('id') id: string,
    @Body() body: { url: string; alt_text?: string; is_primary?: boolean },
  ) {
    return this.productsService.addImage(id, body.url, body.alt_text, body.is_primary);
  }

  @Delete('images/:imageId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove product image' })
  async removeImage(@Param('imageId') imageId: string) {
    await this.productsService.removeImage(imageId);
    return { message: 'Image deleted successfully' };
  }
}

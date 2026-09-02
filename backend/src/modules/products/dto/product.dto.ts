import { IsString, IsOptional, IsBoolean, IsNumber, IsUUID, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'iphone-15-pro' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  short_description?: string;

  @ApiProperty({ example: 999.99 })
  @IsNumber()
  base_price: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  compare_at_price?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  cost_price?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  category_id?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  brand_id?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

export class UpdateProductDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  short_description?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  base_price?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  compare_at_price?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_featured?: boolean;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  category_id?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  brand_id?: string;
}

export class CreateVariantDto {
  @ApiProperty({ example: 'SKU-001' })
  @IsString()
  sku: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: { color: 'Black', size: '128GB' } })
  @IsOptional()
  attributes?: Record<string, any>;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  price_override?: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  stock_quantity: number;
}

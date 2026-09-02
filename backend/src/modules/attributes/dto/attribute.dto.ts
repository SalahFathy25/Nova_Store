import { IsString, IsOptional, IsBoolean, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAttributeDto {
  @ApiProperty({ example: 'Color' })
  @IsString()
  name: string;

  @ApiProperty({ enum: ['text', 'number', 'color', 'select', 'multi_select'] })
  @IsEnum(['text', 'number', 'color', 'select', 'multi_select'])
  type: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_filterable?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_variant?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  display_order?: number;
}

export class UpdateAttributeDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ enum: ['text', 'number', 'color', 'select', 'multi_select'] })
  @IsEnum(['text', 'number', 'color', 'select', 'multi_select'])
  @IsOptional()
  type?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_filterable?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_variant?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  display_order?: number;
}

export class CreateAttributeValueDto {
  @ApiProperty({ example: 'Red' })
  @IsString()
  value: string;

  @ApiPropertyOptional({ example: '#FF0000' })
  @IsString()
  @IsOptional()
  color_code?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  display_order?: number;
}

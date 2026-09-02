import { IsString, IsOptional, IsBoolean, IsNumber, IsDecimal, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiPropertyOptional({ example: 'Home' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  label?: string = 'Home';

  @ApiProperty({ example: '123 Main St, Cairo, Egypt' })
  @IsString()
  full_address: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  street?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(100)
  building?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(50)
  floor?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(50)
  apartment?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  landmark?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(100)
  state?: string;

  @ApiPropertyOptional({ example: 'EG' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  country?: string = 'EG';

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(20)
  postal_code?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  is_default?: boolean = false;
}

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}

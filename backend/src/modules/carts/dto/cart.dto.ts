import { IsString, IsOptional, IsNumber, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ description: 'Product ID' })
  @IsUUID()
  product_id: string;

  @ApiPropertyOptional({ description: 'Product variant ID' })
  @IsUUID()
  @IsOptional()
  product_variant_id?: string;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number = 1;
}

export class UpdateCartItemDto {
  @ApiProperty({ minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

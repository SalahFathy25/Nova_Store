import { IsString, IsOptional, IsUUID, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ description: 'Shipping address ID' })
  @IsUUID()
  address_id: string;

  @ApiProperty({ enum: ['cod', 'card', 'wallet'], description: 'Payment method' })
  @IsString()
  @IsIn(['cod', 'card', 'wallet'])
  payment_method: string;

  @ApiPropertyOptional({ description: 'Coupon code to apply' })
  @IsString()
  @IsOptional()
  coupon_code?: string;

  @ApiPropertyOptional({ description: 'Order notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

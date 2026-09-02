import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateCouponDto {
  @ApiProperty({ example: 'SAVE20' })
  @IsString()
  code: string;

  @ApiProperty({ example: 150.00 })
  @IsNumber()
  @Min(0)
  subtotal: number;
}

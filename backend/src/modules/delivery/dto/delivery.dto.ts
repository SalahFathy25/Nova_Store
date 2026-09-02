import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StartShiftDto {}

export class UpdateLocationDto {
  @ApiProperty({ example: 30.0444 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ example: 31.2357 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiPropertyOptional({ example: 45.5 })
  @IsOptional()
  @IsNumber()
  speed?: number;

  @ApiPropertyOptional({ example: 180.0 })
  @IsOptional()
  @IsNumber()
  heading?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sub_order_id?: string;
}

export class VerifyDeliveryOtpDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  otp: string;
}

export class SubmitCashDto {
  @ApiProperty({ example: 250.00 })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class AssignDriverDto {
  @ApiProperty()
  @IsString()
  driver_id: string;

  @ApiProperty()
  @IsString()
  sub_order_id: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: ['Picked Up', 'On The Way', 'Delivered', 'Failed'] })
  @IsEnum(['Picked Up', 'On The Way', 'Delivered', 'Failed'])
  status: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class RegisterDriverDto {
  @ApiProperty()
  @IsString()
  full_name: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vehicle_type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vehicle_plate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  license_number?: string;
}

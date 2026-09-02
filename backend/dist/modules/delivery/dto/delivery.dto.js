var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsOptional, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class StartShiftDto {
}
export class UpdateLocationDto {
    latitude;
    longitude;
    speed;
    heading;
    sub_order_id;
}
__decorate([
    ApiProperty({ example: 30.0444 }),
    IsNumber(),
    Min(-90),
    Max(90),
    __metadata("design:type", Number)
], UpdateLocationDto.prototype, "latitude", void 0);
__decorate([
    ApiProperty({ example: 31.2357 }),
    IsNumber(),
    Min(-180),
    Max(180),
    __metadata("design:type", Number)
], UpdateLocationDto.prototype, "longitude", void 0);
__decorate([
    ApiPropertyOptional({ example: 45.5 }),
    IsOptional(),
    IsNumber(),
    __metadata("design:type", Number)
], UpdateLocationDto.prototype, "speed", void 0);
__decorate([
    ApiPropertyOptional({ example: 180.0 }),
    IsOptional(),
    IsNumber(),
    __metadata("design:type", Number)
], UpdateLocationDto.prototype, "heading", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateLocationDto.prototype, "sub_order_id", void 0);
export class VerifyDeliveryOtpDto {
    otp;
}
__decorate([
    ApiProperty({ example: '123456' }),
    IsString(),
    __metadata("design:type", String)
], VerifyDeliveryOtpDto.prototype, "otp", void 0);
export class SubmitCashDto {
    amount;
    notes;
}
__decorate([
    ApiProperty({ example: 250.00 }),
    IsNumber(),
    __metadata("design:type", Number)
], SubmitCashDto.prototype, "amount", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], SubmitCashDto.prototype, "notes", void 0);
export class AssignDriverDto {
    driver_id;
    sub_order_id;
}
__decorate([
    ApiProperty(),
    IsString(),
    __metadata("design:type", String)
], AssignDriverDto.prototype, "driver_id", void 0);
__decorate([
    ApiProperty(),
    IsString(),
    __metadata("design:type", String)
], AssignDriverDto.prototype, "sub_order_id", void 0);
export class UpdateOrderStatusDto {
    status;
    notes;
}
__decorate([
    ApiProperty({ enum: ['Picked Up', 'On The Way', 'Delivered', 'Failed'] }),
    IsEnum(['Picked Up', 'On The Way', 'Delivered', 'Failed']),
    __metadata("design:type", String)
], UpdateOrderStatusDto.prototype, "status", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateOrderStatusDto.prototype, "notes", void 0);
export class RegisterDriverDto {
    full_name;
    phone;
    password;
    email;
    vehicle_type;
    vehicle_plate;
    license_number;
}
__decorate([
    ApiProperty(),
    IsString(),
    __metadata("design:type", String)
], RegisterDriverDto.prototype, "full_name", void 0);
__decorate([
    ApiProperty(),
    IsString(),
    __metadata("design:type", String)
], RegisterDriverDto.prototype, "phone", void 0);
__decorate([
    ApiProperty(),
    IsString(),
    __metadata("design:type", String)
], RegisterDriverDto.prototype, "password", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], RegisterDriverDto.prototype, "email", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], RegisterDriverDto.prototype, "vehicle_type", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], RegisterDriverDto.prototype, "vehicle_plate", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], RegisterDriverDto.prototype, "license_number", void 0);
//# sourceMappingURL=delivery.dto.js.map
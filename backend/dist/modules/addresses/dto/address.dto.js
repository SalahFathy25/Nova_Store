var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsOptional, IsBoolean, IsNumber, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
export class CreateAddressDto {
    label = 'Home';
    full_address;
    street;
    building;
    floor;
    apartment;
    landmark;
    city;
    state;
    country = 'EG';
    postal_code;
    latitude;
    longitude;
    is_default = false;
}
__decorate([
    ApiPropertyOptional({ example: 'Home' }),
    IsString(),
    IsOptional(),
    MaxLength(100),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "label", void 0);
__decorate([
    ApiProperty({ example: '123 Main St, Cairo, Egypt' }),
    IsString(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "full_address", void 0);
__decorate([
    ApiPropertyOptional(),
    IsString(),
    IsOptional(),
    MaxLength(255),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "street", void 0);
__decorate([
    ApiPropertyOptional(),
    IsString(),
    IsOptional(),
    MaxLength(100),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "building", void 0);
__decorate([
    ApiPropertyOptional(),
    IsString(),
    IsOptional(),
    MaxLength(50),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "floor", void 0);
__decorate([
    ApiPropertyOptional(),
    IsString(),
    IsOptional(),
    MaxLength(50),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "apartment", void 0);
__decorate([
    ApiPropertyOptional(),
    IsString(),
    IsOptional(),
    MaxLength(255),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "landmark", void 0);
__decorate([
    ApiPropertyOptional(),
    IsString(),
    IsOptional(),
    MaxLength(100),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "city", void 0);
__decorate([
    ApiPropertyOptional(),
    IsString(),
    IsOptional(),
    MaxLength(100),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "state", void 0);
__decorate([
    ApiPropertyOptional({ example: 'EG' }),
    IsString(),
    IsOptional(),
    MaxLength(100),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "country", void 0);
__decorate([
    ApiPropertyOptional(),
    IsString(),
    IsOptional(),
    MaxLength(20),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "postal_code", void 0);
__decorate([
    ApiPropertyOptional(),
    IsNumber(),
    IsOptional(),
    __metadata("design:type", Number)
], CreateAddressDto.prototype, "latitude", void 0);
__decorate([
    ApiPropertyOptional(),
    IsNumber(),
    IsOptional(),
    __metadata("design:type", Number)
], CreateAddressDto.prototype, "longitude", void 0);
__decorate([
    ApiPropertyOptional({ example: false }),
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateAddressDto.prototype, "is_default", void 0);
export class UpdateAddressDto extends PartialType(CreateAddressDto) {
}
//# sourceMappingURL=address.dto.js.map
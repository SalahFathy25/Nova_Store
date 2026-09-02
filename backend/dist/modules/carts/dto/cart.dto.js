var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsOptional, IsNumber, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class AddToCartDto {
    product_id;
    product_variant_id;
    quantity = 1;
}
__decorate([
    ApiProperty({ description: 'Product ID' }),
    IsUUID(),
    __metadata("design:type", String)
], AddToCartDto.prototype, "product_id", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Product variant ID' }),
    IsUUID(),
    IsOptional(),
    __metadata("design:type", String)
], AddToCartDto.prototype, "product_variant_id", void 0);
__decorate([
    ApiPropertyOptional({ default: 1, minimum: 1 }),
    IsNumber(),
    Min(1),
    IsOptional(),
    __metadata("design:type", Number)
], AddToCartDto.prototype, "quantity", void 0);
export class UpdateCartItemDto {
    quantity;
}
__decorate([
    ApiProperty({ minimum: 1 }),
    IsNumber(),
    Min(1),
    __metadata("design:type", Number)
], UpdateCartItemDto.prototype, "quantity", void 0);
//# sourceMappingURL=cart.dto.js.map
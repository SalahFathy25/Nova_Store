var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsOptional, IsUUID, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateOrderDto {
    address_id;
    payment_method;
    coupon_code;
    notes;
}
__decorate([
    ApiProperty({ description: 'Shipping address ID' }),
    IsUUID(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "address_id", void 0);
__decorate([
    ApiProperty({ enum: ['cod', 'card', 'wallet'], description: 'Payment method' }),
    IsString(),
    IsIn(['cod', 'card', 'wallet']),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "payment_method", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Coupon code to apply' }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "coupon_code", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Order notes' }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "notes", void 0);
//# sourceMappingURL=order.dto.js.map
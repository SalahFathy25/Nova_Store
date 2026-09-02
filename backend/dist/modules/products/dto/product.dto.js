var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsOptional, IsBoolean, IsNumber, IsUUID, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateProductDto {
    title;
    slug;
    description;
    short_description;
    base_price;
    compare_at_price;
    cost_price;
    sku;
    category_id;
    brand_id;
    tags;
}
__decorate([
    ApiProperty({ example: 'iPhone 15 Pro' }),
    IsString(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "title", void 0);
__decorate([
    ApiPropertyOptional({ example: 'iphone-15-pro' }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "slug", void 0);
__decorate([
    ApiPropertyOptional(),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    ApiPropertyOptional(),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "short_description", void 0);
__decorate([
    ApiProperty({ example: 999.99 }),
    IsNumber(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "base_price", void 0);
__decorate([
    ApiPropertyOptional(),
    IsNumber(),
    IsOptional(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "compare_at_price", void 0);
__decorate([
    ApiPropertyOptional(),
    IsNumber(),
    IsOptional(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "cost_price", void 0);
__decorate([
    ApiPropertyOptional(),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "sku", void 0);
__decorate([
    ApiPropertyOptional(),
    IsUUID(),
    IsOptional(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "category_id", void 0);
__decorate([
    ApiPropertyOptional(),
    IsUUID(),
    IsOptional(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "brand_id", void 0);
__decorate([
    ApiPropertyOptional(),
    IsArray(),
    IsString({ each: true }),
    IsOptional(),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "tags", void 0);
export class UpdateProductDto {
    title;
    slug;
    description;
    short_description;
    base_price;
    compare_at_price;
    is_active;
    is_featured;
    category_id;
    brand_id;
}
__decorate([
    ApiPropertyOptional(),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "title", void 0);
__decorate([
    ApiPropertyOptional(),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "slug", void 0);
__decorate([
    ApiPropertyOptional(),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "description", void 0);
__decorate([
    ApiPropertyOptional(),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "short_description", void 0);
__decorate([
    ApiPropertyOptional(),
    IsNumber(),
    IsOptional(),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "base_price", void 0);
__decorate([
    ApiPropertyOptional(),
    IsNumber(),
    IsOptional(),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "compare_at_price", void 0);
__decorate([
    ApiPropertyOptional(),
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], UpdateProductDto.prototype, "is_active", void 0);
__decorate([
    ApiPropertyOptional(),
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], UpdateProductDto.prototype, "is_featured", void 0);
__decorate([
    ApiPropertyOptional(),
    IsUUID(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "category_id", void 0);
__decorate([
    ApiPropertyOptional(),
    IsUUID(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "brand_id", void 0);
export class CreateVariantDto {
    sku;
    title;
    attributes;
    price_override;
    stock_quantity;
}
__decorate([
    ApiProperty({ example: 'SKU-001' }),
    IsString(),
    __metadata("design:type", String)
], CreateVariantDto.prototype, "sku", void 0);
__decorate([
    ApiPropertyOptional(),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateVariantDto.prototype, "title", void 0);
__decorate([
    ApiPropertyOptional({ example: { color: 'Black', size: '128GB' } }),
    IsOptional(),
    __metadata("design:type", Object)
], CreateVariantDto.prototype, "attributes", void 0);
__decorate([
    ApiPropertyOptional(),
    IsNumber(),
    IsOptional(),
    __metadata("design:type", Number)
], CreateVariantDto.prototype, "price_override", void 0);
__decorate([
    ApiProperty({ example: 100 }),
    IsNumber(),
    __metadata("design:type", Number)
], CreateVariantDto.prototype, "stock_quantity", void 0);
//# sourceMappingURL=product.dto.js.map
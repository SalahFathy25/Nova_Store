var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsOptional, IsBoolean, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateCategoryDto {
    name;
    slug;
    description;
    image_url;
    display_order;
    parent_id;
}
__decorate([
    ApiProperty({ example: 'Electronics' }),
    IsString(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "name", void 0);
__decorate([
    ApiPropertyOptional({ example: 'electronics' }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "slug", void 0);
__decorate([
    ApiPropertyOptional(),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "description", void 0);
__decorate([
    ApiPropertyOptional(),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "image_url", void 0);
__decorate([
    ApiPropertyOptional({ example: 1 }),
    IsNumber(),
    IsOptional(),
    __metadata("design:type", Number)
], CreateCategoryDto.prototype, "display_order", void 0);
__decorate([
    ApiPropertyOptional(),
    IsUUID(),
    IsOptional(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "parent_id", void 0);
export class UpdateCategoryDto {
    name;
    slug;
    description;
    image_url;
    display_order;
    is_active;
    parent_id;
}
__decorate([
    ApiPropertyOptional(),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateCategoryDto.prototype, "name", void 0);
__decorate([
    ApiPropertyOptional(),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateCategoryDto.prototype, "slug", void 0);
__decorate([
    ApiPropertyOptional(),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateCategoryDto.prototype, "description", void 0);
__decorate([
    ApiPropertyOptional(),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateCategoryDto.prototype, "image_url", void 0);
__decorate([
    ApiPropertyOptional(),
    IsNumber(),
    IsOptional(),
    __metadata("design:type", Number)
], UpdateCategoryDto.prototype, "display_order", void 0);
__decorate([
    ApiPropertyOptional(),
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], UpdateCategoryDto.prototype, "is_active", void 0);
__decorate([
    ApiPropertyOptional(),
    IsUUID(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateCategoryDto.prototype, "parent_id", void 0);
//# sourceMappingURL=category.dto.js.map
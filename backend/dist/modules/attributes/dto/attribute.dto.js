var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsOptional, IsBoolean, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateAttributeDto {
    name;
    type;
    is_filterable;
    is_variant;
    display_order;
}
__decorate([
    ApiProperty({ example: 'Color' }),
    IsString(),
    __metadata("design:type", String)
], CreateAttributeDto.prototype, "name", void 0);
__decorate([
    ApiProperty({ enum: ['text', 'number', 'color', 'select', 'multi_select'] }),
    IsEnum(['text', 'number', 'color', 'select', 'multi_select']),
    __metadata("design:type", String)
], CreateAttributeDto.prototype, "type", void 0);
__decorate([
    ApiPropertyOptional(),
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateAttributeDto.prototype, "is_filterable", void 0);
__decorate([
    ApiPropertyOptional(),
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateAttributeDto.prototype, "is_variant", void 0);
__decorate([
    ApiPropertyOptional(),
    IsNumber(),
    IsOptional(),
    __metadata("design:type", Number)
], CreateAttributeDto.prototype, "display_order", void 0);
export class UpdateAttributeDto {
    name;
    type;
    is_filterable;
    is_variant;
    display_order;
}
__decorate([
    ApiPropertyOptional(),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateAttributeDto.prototype, "name", void 0);
__decorate([
    ApiPropertyOptional({ enum: ['text', 'number', 'color', 'select', 'multi_select'] }),
    IsEnum(['text', 'number', 'color', 'select', 'multi_select']),
    IsOptional(),
    __metadata("design:type", String)
], UpdateAttributeDto.prototype, "type", void 0);
__decorate([
    ApiPropertyOptional(),
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], UpdateAttributeDto.prototype, "is_filterable", void 0);
__decorate([
    ApiPropertyOptional(),
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], UpdateAttributeDto.prototype, "is_variant", void 0);
__decorate([
    ApiPropertyOptional(),
    IsNumber(),
    IsOptional(),
    __metadata("design:type", Number)
], UpdateAttributeDto.prototype, "display_order", void 0);
export class CreateAttributeValueDto {
    value;
    color_code;
    display_order;
}
__decorate([
    ApiProperty({ example: 'Red' }),
    IsString(),
    __metadata("design:type", String)
], CreateAttributeValueDto.prototype, "value", void 0);
__decorate([
    ApiPropertyOptional({ example: '#FF0000' }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateAttributeValueDto.prototype, "color_code", void 0);
__decorate([
    ApiPropertyOptional(),
    IsNumber(),
    IsOptional(),
    __metadata("design:type", Number)
], CreateAttributeValueDto.prototype, "display_order", void 0);
//# sourceMappingURL=attribute.dto.js.map
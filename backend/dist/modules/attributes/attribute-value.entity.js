var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, } from 'typeorm';
let AttributeValue = class AttributeValue {
    id;
    attribute_id;
    value;
    color_code;
    display_order;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], AttributeValue.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'attribute_id' }),
    __metadata("design:type", String)
], AttributeValue.prototype, "attribute_id", void 0);
__decorate([
    Column({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], AttributeValue.prototype, "value", void 0);
__decorate([
    Column({ type: 'varchar', length: 7, nullable: true, name: 'color_code' }),
    __metadata("design:type", String)
], AttributeValue.prototype, "color_code", void 0);
__decorate([
    Column({ type: 'int', default: 0, name: 'display_order' }),
    __metadata("design:type", Number)
], AttributeValue.prototype, "display_order", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], AttributeValue.prototype, "created_at", void 0);
AttributeValue = __decorate([
    Entity('attribute_values')
], AttributeValue);
export { AttributeValue };
//# sourceMappingURL=attribute-value.entity.js.map
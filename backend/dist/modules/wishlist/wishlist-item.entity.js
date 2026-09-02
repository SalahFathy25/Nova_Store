var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, } from 'typeorm';
import { User } from '../users/user.entity.js';
import { Product } from '../products/product.entity.js';
import { Store } from '../stores/store.entity.js';
let WishlistItem = class WishlistItem {
    id;
    user_id;
    user;
    product_id;
    product;
    tenant_id;
    store;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], WishlistItem.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'user_id' }),
    __metadata("design:type", String)
], WishlistItem.prototype, "user_id", void 0);
__decorate([
    ManyToOne(() => User, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'user_id' }),
    __metadata("design:type", User)
], WishlistItem.prototype, "user", void 0);
__decorate([
    Column({ type: 'uuid', name: 'product_id' }),
    __metadata("design:type", String)
], WishlistItem.prototype, "product_id", void 0);
__decorate([
    ManyToOne(() => Product, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'product_id' }),
    __metadata("design:type", Product)
], WishlistItem.prototype, "product", void 0);
__decorate([
    Column({ type: 'uuid', name: 'tenant_id' }),
    __metadata("design:type", String)
], WishlistItem.prototype, "tenant_id", void 0);
__decorate([
    ManyToOne(() => Store, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'tenant_id' }),
    __metadata("design:type", Store)
], WishlistItem.prototype, "store", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], WishlistItem.prototype, "created_at", void 0);
WishlistItem = __decorate([
    Entity('wishlist_items')
], WishlistItem);
export { WishlistItem };
//# sourceMappingURL=wishlist-item.entity.js.map
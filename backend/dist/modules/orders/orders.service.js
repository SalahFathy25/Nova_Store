var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ParentOrder } from './parent-order.entity.js';
import { SubOrder } from './sub-order.entity.js';
import { OrderItem } from './order-item.entity.js';
import { OrderStatusHistory } from './order-status-history.entity.js';
import { Cart } from '../carts/cart.entity.js';
import { CartItem } from '../carts/cart-item.entity.js';
import { Product } from '../products/product.entity.js';
import { ProductVariant } from '../products/product-variant.entity.js';
import { UserAddress } from '../addresses/user-address.entity.js';
import { Coupon } from '../coupons/coupon.entity.js';
import { CouponUsage } from '../coupons/coupon-usage.entity.js';
import { Payment } from '../payments/payment.entity.js';
let OrdersService = class OrdersService {
    orderRepo;
    subOrderRepo;
    orderItemRepo;
    statusHistoryRepo;
    cartRepo;
    cartItemRepo;
    productRepo;
    variantRepo;
    addressRepo;
    couponRepo;
    couponUsageRepo;
    paymentRepo;
    constructor(orderRepo, subOrderRepo, orderItemRepo, statusHistoryRepo, cartRepo, cartItemRepo, productRepo, variantRepo, addressRepo, couponRepo, couponUsageRepo, paymentRepo) {
        this.orderRepo = orderRepo;
        this.subOrderRepo = subOrderRepo;
        this.orderItemRepo = orderItemRepo;
        this.statusHistoryRepo = statusHistoryRepo;
        this.cartRepo = cartRepo;
        this.cartItemRepo = cartItemRepo;
        this.productRepo = productRepo;
        this.variantRepo = variantRepo;
        this.addressRepo = addressRepo;
        this.couponRepo = couponRepo;
        this.couponUsageRepo = couponUsageRepo;
        this.paymentRepo = paymentRepo;
    }
    async getOrders(tenantId, userId, page = 1, limit = 10) {
        const [orders, total] = await this.orderRepo.findAndCount({
            where: { tenant_id: tenantId, customer_id: userId },
            order: { created_at: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        const totalPages = Math.ceil(total / limit);
        return {
            orders,
            total,
            page,
            limit,
            totalPages,
        };
    }
    async getOrder(tenantId, userId, orderId) {
        const order = await this.orderRepo.findOne({
            where: { id: orderId, tenant_id: tenantId, customer_id: userId },
        });
        if (!order) {
            throw new NotFoundException('Order not found');
        }
        const subOrders = await this.subOrderRepo.find({
            where: { parent_order_id: orderId },
        });
        for (const sub of subOrders) {
            sub.items = await this.orderItemRepo.find({
                where: { sub_order_id: sub.id },
                relations: { product: true, product_variant: true },
            });
        }
        const statusHistory = await this.statusHistoryRepo.find({
            where: { order_id: orderId },
            relations: { changer: true },
            order: { created_at: 'ASC' },
        });
        return {
            ...order,
            sub_orders: subOrders,
            status_timeline: statusHistory,
        };
    }
    async createOrder(tenantId, userId, dto) {
        const cart = await this.cartRepo.findOne({
            where: { tenant_id: tenantId, user_id: userId },
        });
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }
        const cartItems = await this.cartItemRepo.find({
            where: { cart_id: cart.id },
            relations: { product_variant: { product: true } },
        });
        if (cartItems.length === 0) {
            throw new BadRequestException('Cart is empty');
        }
        for (const item of cartItems) {
            const variant = item.product_variant;
            if (!variant || !variant.is_active) {
                throw new BadRequestException(`Product variant is no longer available`);
            }
            if (variant.stock_quantity < item.quantity) {
                throw new BadRequestException(`Insufficient stock for ${variant.title ?? variant.sku}. Available: ${variant.stock_quantity}`);
            }
        }
        const address = await this.addressRepo.findOne({
            where: { id: dto.address_id, tenant_id: tenantId, user_id: userId },
        });
        if (!address) {
            throw new NotFoundException('Shipping address not found');
        }
        let subtotal = 0;
        let totalDiscount = 0;
        let couponDiscount = 0;
        for (const item of cartItems) {
            const variant = item.product_variant;
            const product = variant.product;
            const effectivePrice = variant.price_override ?? product.base_price;
            const lineTotal = effectivePrice * item.quantity;
            const lineDiscount = item.discount_amount * item.quantity;
            subtotal += lineTotal;
            totalDiscount += lineDiscount;
        }
        let coupon = null;
        if (dto.coupon_code) {
            coupon = await this.couponRepo.findOne({
                where: { tenant_id: tenantId, code: dto.coupon_code, is_active: true },
            });
            if (!coupon) {
                throw new BadRequestException('Invalid coupon code');
            }
            const now = new Date();
            if (coupon.starts_at && now < coupon.starts_at) {
                throw new BadRequestException('Coupon is not yet active');
            }
            if (coupon.expires_at && now > coupon.expires_at) {
                throw new BadRequestException('Coupon has expired');
            }
            if (coupon.usage_limit !== null && coupon.current_usage >= coupon.usage_limit) {
                throw new BadRequestException('Coupon usage limit reached');
            }
            const userUsage = await this.couponUsageRepo.count({
                where: { coupon_id: coupon.id, user_id: userId },
            });
            if (userUsage >= coupon.usage_limit_per_user) {
                throw new BadRequestException('You have reached the usage limit for this coupon');
            }
            const effectiveSubtotal = subtotal - totalDiscount;
            if (coupon.minimum_order > 0 && effectiveSubtotal < coupon.minimum_order) {
                throw new BadRequestException(`Minimum order amount for this coupon is ${coupon.minimum_order} EGP`);
            }
            if (coupon.type === 'percentage') {
                couponDiscount = (effectiveSubtotal * coupon.value) / 100;
                if (coupon.maximum_discount !== null && couponDiscount > coupon.maximum_discount) {
                    couponDiscount = coupon.maximum_discount;
                }
            }
            else if (coupon.type === 'fixed') {
                couponDiscount = Math.min(coupon.value, effectiveSubtotal);
            }
        }
        const shippingFee = 30;
        const taxableAmount = subtotal - totalDiscount - couponDiscount;
        const taxAmount = Math.round(taxableAmount * 0.14 * 100) / 100;
        const grandTotal = Math.round((taxableAmount + shippingFee + taxAmount) * 100) / 100;
        const orderNumber = await this.generateOrderNumber(tenantId);
        const parentOrder = this.orderRepo.create({
            tenant_id: tenantId,
            customer_id: userId,
            order_number: orderNumber,
            status: 'Pending',
            subtotal: Math.round(subtotal * 100) / 100,
            discount_amount: Math.round(totalDiscount * 100) / 100,
            shipping_fee: shippingFee,
            tax_amount: taxAmount,
            grand_total: grandTotal,
            total_amount: grandTotal,
            payment_method: dto.payment_method,
            payment_status: 'Pending',
            shipping_address: {
                id: address.id,
                label: address.label,
                full_address: address.full_address,
                street: address.street,
                building: address.building,
                floor: address.floor,
                apartment: address.apartment,
                landmark: address.landmark,
                city: address.city,
                state: address.state,
                country: address.country,
                postal_code: address.postal_code,
                latitude: address.latitude,
                longitude: address.longitude,
            },
            notes: dto.notes,
            coupon_code: coupon?.code,
            coupon_discount: Math.round(couponDiscount * 100) / 100,
        });
        const savedOrder = await this.orderRepo.save(parentOrder);
        const subOrder = this.subOrderRepo.create({
            parent_order_id: savedOrder.id,
            order_status: 'Pending',
            payment_status: 'Pending',
            delivery_status: 'Unassigned',
            subtotal: savedOrder.subtotal,
            delivery_fee: 0,
            commission_amount: 0,
            net_amount: savedOrder.subtotal,
            delivery_otp: this.generateOtp(),
            otp_expires_at: new Date(Date.now() + 30 * 60 * 1000),
        });
        const savedSubOrder = await this.subOrderRepo.save(subOrder);
        const orderItems = [];
        for (const item of cartItems) {
            const variant = item.product_variant;
            const product = variant.product;
            const effectivePrice = variant.price_override ?? product.base_price;
            const lineTotal = effectivePrice * item.quantity;
            const orderItem = this.orderItemRepo.create({
                sub_order_id: savedSubOrder.id,
                product_id: product.id,
                product_variant_id: variant.id,
                product_title: product.title,
                variant_title: variant.title,
                quantity: item.quantity,
                unit_price: effectivePrice,
                total_price: Math.round(lineTotal * 100) / 100,
                discount_amount: item.discount_amount * item.quantity,
                tax_amount: 0,
                image_url: variant.image_url,
            });
            orderItems.push(orderItem);
            variant.stock_quantity -= item.quantity;
            await this.variantRepo.save(variant);
        }
        await this.orderItemRepo.save(orderItems);
        const statusHistory = this.statusHistoryRepo.create({
            order_id: savedOrder.id,
            from_status: undefined,
            to_status: 'Pending',
            changed_by: userId,
            reason: 'Order placed',
            metadata: {},
        });
        await this.statusHistoryRepo.save(statusHistory);
        if (coupon) {
            const couponUsage = this.couponUsageRepo.create({
                coupon_id: coupon.id,
                user_id: userId,
                order_id: savedOrder.id,
                discount_amount: Math.round(couponDiscount * 100) / 100,
            });
            await this.couponUsageRepo.save(couponUsage);
            coupon.current_usage += 1;
            await this.couponRepo.save(coupon);
        }
        await this.cartItemRepo.delete({ cart_id: cart.id });
        const payment = this.paymentRepo.create({
            order_id: savedOrder.id,
            tenant_id: tenantId,
            provider: dto.payment_method,
            amount: grandTotal,
            currency: 'EGP',
            status: 'Pending',
        });
        await this.paymentRepo.save(payment);
        return this.getOrder(tenantId, userId, savedOrder.id);
    }
    async cancelOrder(tenantId, userId, orderId) {
        const order = await this.orderRepo.findOne({
            where: { id: orderId, tenant_id: tenantId, customer_id: userId },
        });
        if (!order) {
            throw new NotFoundException('Order not found');
        }
        if (!['Pending', 'Confirmed'].includes(order.status)) {
            throw new BadRequestException(`Cannot cancel order with status "${order.status}". Only Pending or Confirmed orders can be cancelled.`);
        }
        const previousStatus = order.status;
        order.status = 'Cancelled';
        await this.orderRepo.save(order);
        const subOrders = await this.subOrderRepo.find({
            where: { parent_order_id: orderId },
        });
        for (const sub of subOrders) {
            sub.order_status = 'Cancelled';
            await this.subOrderRepo.save(sub);
        }
        const items = await this.orderItemRepo.find({
            where: { sub_order_id: In(subOrders.map((s) => s.id)) },
        });
        for (const item of items) {
            const variant = await this.variantRepo.findOne({
                where: { id: item.product_variant_id },
            });
            if (variant) {
                variant.stock_quantity += item.quantity;
                await this.variantRepo.save(variant);
            }
        }
        const statusHistory = this.statusHistoryRepo.create({
            order_id: orderId,
            from_status: previousStatus,
            to_status: 'Cancelled',
            changed_by: userId,
            reason: 'Cancelled by customer',
            metadata: {},
        });
        await this.statusHistoryRepo.save(statusHistory);
        return this.getOrder(tenantId, userId, orderId);
    }
    async getStatusTimeline(orderId) {
        const history = await this.statusHistoryRepo.find({
            where: { order_id: orderId },
            relations: { changer: true },
            order: { created_at: 'ASC' },
        });
        return history.map((h) => ({
            status: h.to_status,
            from_status: h.from_status,
            changed_by: h.changer
                ? { id: h.changer.id, name: h.changer.name ?? null }
                : null,
            reason: h.reason,
            created_at: h.created_at,
        }));
    }
    async generateOrderNumber(tenantId) {
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
        const lastOrder = await this.orderRepo.findOne({
            where: { tenant_id: tenantId },
            order: { created_at: 'DESC' },
        });
        let sequence = 1;
        if (lastOrder && lastOrder.order_number) {
            const parts = lastOrder.order_number.split('-');
            const lastDate = parts[1];
            const lastSeq = parseInt(parts[2], 10);
            if (lastDate === dateStr && !isNaN(lastSeq)) {
                sequence = lastSeq + 1;
            }
        }
        return `ORD-${dateStr}-${String(sequence).padStart(4, '0')}`;
    }
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
};
OrdersService = __decorate([
    Injectable(),
    __param(0, InjectRepository(ParentOrder)),
    __param(1, InjectRepository(SubOrder)),
    __param(2, InjectRepository(OrderItem)),
    __param(3, InjectRepository(OrderStatusHistory)),
    __param(4, InjectRepository(Cart)),
    __param(5, InjectRepository(CartItem)),
    __param(6, InjectRepository(Product)),
    __param(7, InjectRepository(ProductVariant)),
    __param(8, InjectRepository(UserAddress)),
    __param(9, InjectRepository(Coupon)),
    __param(10, InjectRepository(CouponUsage)),
    __param(11, InjectRepository(Payment)),
    __metadata("design:paramtypes", [Repository,
        Repository,
        Repository,
        Repository,
        Repository,
        Repository,
        Repository,
        Repository,
        Repository,
        Repository,
        Repository,
        Repository])
], OrdersService);
export { OrdersService };
//# sourceMappingURL=orders.service.js.map
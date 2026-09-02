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
import { CreateOrderDto } from './dto/order.dto.js';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(ParentOrder)
    private readonly orderRepo: Repository<ParentOrder>,
    @InjectRepository(SubOrder)
    private readonly subOrderRepo: Repository<SubOrder>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(OrderStatusHistory)
    private readonly statusHistoryRepo: Repository<OrderStatusHistory>,
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
    @InjectRepository(UserAddress)
    private readonly addressRepo: Repository<UserAddress>,
    @InjectRepository(Coupon)
    private readonly couponRepo: Repository<Coupon>,
    @InjectRepository(CouponUsage)
    private readonly couponUsageRepo: Repository<CouponUsage>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  async getOrders(tenantId: string, userId: string, page = 1, limit = 10) {
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

  async getOrder(tenantId: string, userId: string, orderId: string) {
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
      (sub as any).items = await this.orderItemRepo.find({
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

  async createOrder(tenantId: string, userId: string, dto: CreateOrderDto) {
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
        throw new BadRequestException(
          `Insufficient stock for ${variant.title ?? variant.sku}. Available: ${variant.stock_quantity}`,
        );
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

    let coupon: Coupon | null = null;
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
        throw new BadRequestException(
          `Minimum order amount for this coupon is ${coupon.minimum_order} EGP`,
        );
      }

      if (coupon.type === 'percentage') {
        couponDiscount = (effectiveSubtotal * coupon.value) / 100;
        if (coupon.maximum_discount !== null && couponDiscount > coupon.maximum_discount) {
          couponDiscount = coupon.maximum_discount;
        }
      } else if (coupon.type === 'fixed') {
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

    const orderItems: OrderItem[] = [];
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

  async cancelOrder(tenantId: string, userId: string, orderId: string) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, tenant_id: tenantId, customer_id: userId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!['Pending', 'Confirmed'].includes(order.status)) {
      throw new BadRequestException(
        `Cannot cancel order with status "${order.status}". Only Pending or Confirmed orders can be cancelled.`,
      );
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

  async getStatusTimeline(orderId: string) {
    const history = await this.statusHistoryRepo.find({
      where: { order_id: orderId },
      relations: { changer: true },
      order: { created_at: 'ASC' },
    });

    return history.map((h) => ({
      status: h.to_status,
      from_status: h.from_status,
      changed_by: h.changer
        ? { id: h.changer.id, name: (h.changer as any).name ?? null }
        : null,
      reason: h.reason,
      created_at: h.created_at,
    }));
  }

  private async generateOrderNumber(tenantId: string): Promise<string> {
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

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Coupon } from './coupon.entity.js';
import { CouponUsage } from './coupon-usage.entity.js';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepo: Repository<Coupon>,
    @InjectRepository(CouponUsage)
    private readonly usageRepo: Repository<CouponUsage>,
  ) {}

  async validateCoupon(
    tenantId: string,
    code: string,
    subtotal: number,
    userId: string,
  ): Promise<{
    valid: boolean;
    coupon: Coupon;
    discount_amount: number;
    discount_type: string;
    discount_value: number;
    message: string;
  }> {
    const coupon = await this.couponRepo.findOne({
      where: { tenant_id: tenantId, code: code.toUpperCase(), is_active: true },
    });

    if (!coupon) {
      throw new NotFoundException('Invalid coupon code');
    }

    const now = new Date();

    if (coupon.starts_at && coupon.starts_at > now) {
      throw new BadRequestException('Coupon is not yet active');
    }

    if (coupon.expires_at && coupon.expires_at < now) {
      throw new BadRequestException('Coupon has expired');
    }

    if (subtotal < coupon.minimum_order) {
      throw new BadRequestException(
        `Minimum order amount is ${coupon.minimum_order}`,
      );
    }

    if (coupon.usage_limit && coupon.current_usage >= coupon.usage_limit) {
      throw new BadRequestException('Coupon usage limit reached');
    }

    if (coupon.usage_limit_per_user) {
      const userUsageCount = await this.usageRepo.count({
        where: { coupon_id: coupon.id, user_id: userId },
      });

      if (userUsageCount >= coupon.usage_limit_per_user) {
        throw new BadRequestException('You have reached the usage limit for this coupon');
      }
    }

    const discount_amount = this.calculateDiscount(coupon, subtotal);

    return {
      valid: true,
      coupon,
      discount_amount,
      discount_type: coupon.type,
      discount_value: coupon.value,
      message: 'Coupon applied successfully',
    };
  }

  private calculateDiscount(coupon: Coupon, subtotal: number): number {
    let discount = 0;

    switch (coupon.type) {
      case 'percentage':
        discount = (subtotal * coupon.value) / 100;
        if (coupon.maximum_discount) {
          discount = Math.min(discount, coupon.maximum_discount);
        }
        break;

      case 'fixed':
        discount = Math.min(coupon.value, subtotal);
        break;

      case 'free_shipping':
        discount = 0;
        break;

      case 'bogo':
        discount = 0;
        break;

      default:
        discount = 0;
    }

    return Math.round(discount * 100) / 100;
  }
}

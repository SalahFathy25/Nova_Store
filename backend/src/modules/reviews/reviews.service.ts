import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductReview } from './product-review.entity.js';
import { CreateReviewDto } from './dto/review.dto.js';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ProductReview)
    private readonly reviewRepo: Repository<ProductReview>,
  ) {}

  async findByProduct(
    productId: string,
    page = 1,
    limit = 20,
  ): Promise<{ data: ProductReview[]; total: number; averageRating: number; ratingDistribution: Record<number, number> }> {
    const query = this.reviewRepo
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.product_id = :productId', { productId })
      .andWhere('review.is_approved = :approved', { approved: true });

    const total = await query.getCount();

    const reviews = await query
      .orderBy('review.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const avgResult = await this.reviewRepo
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avg')
      .where('review.product_id = :productId', { productId })
      .andWhere('review.is_approved = :approved', { approved: true })
      .getRawOne();

    const avgRow = await this.reviewRepo
      .createQueryBuilder('review')
      .select('review.rating', 'rating')
      .addSelect('COUNT(*)', 'count')
      .where('review.product_id = :productId', { productId })
      .andWhere('review.is_approved = :approved', { approved: true })
      .groupBy('review.rating')
      .getRawMany();

    const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const row of avgRow) {
      ratingDistribution[row.rating] = parseInt(row.count, 10);
    }

    return {
      data: reviews,
      total,
      averageRating: parseFloat(avgResult?.avg) || 0,
      ratingDistribution,
    };
  }

  async create(dto: CreateReviewDto, userId: string, tenantId: string): Promise<ProductReview> {
    const existing = await this.reviewRepo.findOne({
      where: {
        user_id: userId,
        product_id: dto.product_id,
        order_id: dto.order_id || undefined,
      },
    });

    if (existing) {
      throw new ConflictException('You have already reviewed this product for this order');
    }

    const review = this.reviewRepo.create({
      ...dto,
      user_id: userId,
      tenant_id: tenantId,
      is_verified_purchase: !!dto.order_id,
    });

    return this.reviewRepo.save(review);
  }

  async markHelpful(reviewId: string): Promise<ProductReview> {
    const review = await this.reviewRepo.findOne({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    review.helpful_count += 1;
    return this.reviewRepo.save(review);
  }

  async remove(reviewId: string, userId: string): Promise<void> {
    const review = await this.reviewRepo.findOne({
      where: { id: reviewId, user_id: userId },
    });
    if (!review) {
      throw new NotFoundException('Review not found or not owned by user');
    }
    await this.reviewRepo.remove(review);
  }
}

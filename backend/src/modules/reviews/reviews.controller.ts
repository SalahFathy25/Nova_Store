import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service.js';
import { CreateReviewDto } from './dto/review.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CurrentTenantId } from '../../common/decorators/tenant.decorator.js';

@ApiTags('Reviews')
@Controller('api/v1/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get reviews for a product' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findByProduct(
    @Param('productId') productId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.reviewsService.findByProduct(productId, page || 1, limit || 20);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a review' })
  async create(
    @Body() dto: CreateReviewDto,
    @Request() req: any,
    @CurrentTenantId() tenantId: string,
  ) {
    return this.reviewsService.create(dto, req.user.id, tenantId);
  }

  @Patch(':id/helpful')
  @ApiOperation({ summary: 'Mark review as helpful' })
  async markHelpful(@Param('id') id: string) {
    return this.reviewsService.markHelpful(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete own review' })
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.reviewsService.remove(id, req.user.id);
    return { message: 'Review deleted successfully' };
  }
}

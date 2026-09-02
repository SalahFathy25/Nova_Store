import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CurrentTenantId } from '../../common/decorators/tenant.decorator.js';
import { CurrentUser } from '../../common/decorators/user.decorator.js';
import { IsUUID } from 'class-validator';

class AddToWishlistDto {
  @ApiProperty({ description: 'Product ID to add to wishlist' })
  @IsUUID()
  product_id: string;
}

@ApiTags('Wishlist')
@Controller('api/v1/wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user wishlist' })
  @ApiResponse({ status: 200, description: 'Wishlist retrieved successfully' })
  async getWishlist(
    @CurrentTenantId() tenantId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.wishlistService.getWishlist(tenantId, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add product to wishlist' })
  @ApiResponse({ status: 201, description: 'Product added to wishlist' })
  async addToWishlist(
    @CurrentTenantId() tenantId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: AddToWishlistDto,
  ) {
    return this.wishlistService.addToWishlist(tenantId, userId, dto.product_id);
  }

  @Delete(':productId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove product from wishlist' })
  @ApiResponse({ status: 200, description: 'Product removed from wishlist' })
  async removeFromWishlist(
    @CurrentTenantId() tenantId: string,
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.removeFromWishlist(tenantId, userId, productId);
  }
}

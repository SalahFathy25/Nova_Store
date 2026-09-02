import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CartsService } from './carts.service.js';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CurrentTenantId } from '../../common/decorators/tenant.decorator.js';
import { CurrentUser } from '../../common/decorators/user.decorator.js';

@ApiTags('Cart')
@Controller('api/v1/cart')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  async getCart(
    @CurrentTenantId() tenantId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.cartsService.getCart(tenantId, userId);
  }

  @Post('items')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart successfully' })
  async addItem(
    @CurrentTenantId() tenantId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: AddToCartDto,
  ) {
    return this.cartsService.addToCart(tenantId, userId, dto);
  }

  @Patch('items/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiResponse({ status: 200, description: 'Cart item updated successfully' })
  async updateItem(
    @CurrentTenantId() tenantId: string,
    @CurrentUser('id') userId: string,
    @Param('id') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartsService.updateCartItem(tenantId, userId, itemId, dto);
  }

  @Delete('items/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Cart item removed successfully' })
  async removeItem(
    @CurrentTenantId() tenantId: string,
    @CurrentUser('id') userId: string,
    @Param('id') itemId: string,
  ) {
    return this.cartsService.removeCartItem(tenantId, userId, itemId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Clear all items from cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  async clearCart(
    @CurrentTenantId() tenantId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.cartsService.clearCart(tenantId, userId);
  }
}

import { Controller, Get, Post, Put, Delete, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AddressesService } from './addresses.service.js';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CurrentTenantId } from '../../common/decorators/tenant.decorator.js';
import { CurrentUser } from '../../common/decorators/user.decorator.js';

@ApiTags('Addresses')
@Controller('api/v1/addresses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all user addresses' })
  async findAll(
    @CurrentTenantId() tenantId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.addressesService.getAll(tenantId, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get address by ID' })
  async findOne(
    @Param('id') id: string,
    @CurrentTenantId() tenantId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.addressesService.getOne(tenantId, userId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new address' })
  async create(
    @Body() dto: CreateAddressDto,
    @CurrentTenantId() tenantId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.addressesService.create(tenantId, userId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an address' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
    @CurrentTenantId() tenantId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.addressesService.update(tenantId, userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an address' })
  async remove(
    @Param('id') id: string,
    @CurrentTenantId() tenantId: string,
    @CurrentUser('id') userId: string,
  ) {
    await this.addressesService.delete(tenantId, userId, id);
    return { message: 'Address deleted successfully' };
  }

  @Patch(':id/default')
  @ApiOperation({ summary: 'Set address as default' })
  async setDefault(
    @Param('id') id: string,
    @CurrentTenantId() tenantId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.addressesService.setDefault(tenantId, userId, id);
  }
}

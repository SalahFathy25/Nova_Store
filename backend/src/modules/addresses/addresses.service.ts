import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAddress } from './user-address.entity.js';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto.js';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(UserAddress)
    private readonly addressRepo: Repository<UserAddress>,
  ) {}

  async getAll(tenantId: string, userId: string): Promise<UserAddress[]> {
    return this.addressRepo.find({
      where: { tenant_id: tenantId, user_id: userId },
      order: { is_default: 'DESC', created_at: 'DESC' },
    });
  }

  async getOne(tenantId: string, userId: string, id: string): Promise<UserAddress> {
    const address = await this.addressRepo.findOne({
      where: { id, tenant_id: tenantId, user_id: userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return address;
  }

  async create(tenantId: string, userId: string, dto: CreateAddressDto): Promise<UserAddress> {
    if (dto.is_default) {
      await this.unsetDefaults(tenantId, userId);
    }

    const address = this.addressRepo.create({
      ...dto,
      tenant_id: tenantId,
      user_id: userId,
    });

    return this.addressRepo.save(address);
  }

  async update(
    tenantId: string,
    userId: string,
    id: string,
    dto: UpdateAddressDto,
  ): Promise<UserAddress> {
    const address = await this.getOne(tenantId, userId, id);

    if (dto.is_default) {
      await this.unsetDefaults(tenantId, userId);
    }

    Object.assign(address, dto);
    return this.addressRepo.save(address);
  }

  async delete(tenantId: string, userId: string, id: string): Promise<void> {
    const address = await this.getOne(tenantId, userId, id);
    await this.addressRepo.remove(address);
  }

  async setDefault(tenantId: string, userId: string, id: string): Promise<UserAddress> {
    const address = await this.getOne(tenantId, userId, id);

    await this.unsetDefaults(tenantId, userId);

    address.is_default = true;
    return this.addressRepo.save(address);
  }

  private async unsetDefaults(tenantId: string, userId: string): Promise<void> {
    await this.addressRepo.update(
      { tenant_id: tenantId, user_id: userId, is_default: true },
      { is_default: false },
    );
  }
}

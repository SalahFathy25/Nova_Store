import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './brand.entity.js';
import { CreateBrandDto, UpdateBrandDto } from './dto/brand.dto.js';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
  ) {}

  async findAll(tenantId: string): Promise<Brand[]> {
    return this.brandRepo.find({
      where: { tenant_id: tenantId },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string, tenantId: string): Promise<Brand> {
    const brand = await this.brandRepo.findOne({
      where: { id, tenant_id: tenantId },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    return brand;
  }

  async create(dto: CreateBrandDto, tenantId: string): Promise<Brand> {
    const slug = dto.slug || this.generateSlug(dto.name);

    const existing = await this.brandRepo.findOne({
      where: { tenant_id: tenantId, slug },
    });

    if (existing) {
      throw new BadRequestException('Brand with this slug already exists');
    }

    const brand = this.brandRepo.create({
      ...dto,
      tenant_id: tenantId,
      slug,
    });

    return this.brandRepo.save(brand);
  }

  async update(id: string, dto: UpdateBrandDto, tenantId: string): Promise<Brand> {
    const brand = await this.findOne(id, tenantId);

    if (dto.slug && dto.slug !== brand.slug) {
      const existing = await this.brandRepo.findOne({
        where: { tenant_id: tenantId, slug: dto.slug },
      });

      if (existing) {
        throw new BadRequestException('Brand with this slug already exists');
      }
    }

    Object.assign(brand, dto);
    return this.brandRepo.save(brand);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const brand = await this.findOne(id, tenantId);
    await this.brandRepo.remove(brand);
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}

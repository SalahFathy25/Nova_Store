import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category } from './category.entity.js';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async findAll(tenantId: string): Promise<Category[]> {
    return this.categoryRepo.find({
      where: { tenant_id: tenantId, parent_id: IsNull() },
      order: { display_order: 'ASC' },
    });
  }

  async findOne(id: string, tenantId: string): Promise<Category> {
    const category = await this.categoryRepo.findOne({
      where: { id, tenant_id: tenantId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async findChildren(id: string, tenantId: string): Promise<Category[]> {
    return this.categoryRepo.find({
      where: { parent_id: id, tenant_id: tenantId },
      order: { display_order: 'ASC' },
    });
  }

  async create(dto: CreateCategoryDto, tenantId: string): Promise<Category> {
    const slug = dto.slug || this.generateSlug(dto.name);

    const existing = await this.categoryRepo.findOne({
      where: { tenant_id: tenantId, slug },
    });

    if (existing) {
      throw new BadRequestException('Category with this slug already exists');
    }

    const category = this.categoryRepo.create({
      ...dto,
      tenant_id: tenantId,
      slug,
    });

    return this.categoryRepo.save(category);
  }

  async update(
    id: string,
    dto: UpdateCategoryDto,
    tenantId: string,
  ): Promise<Category> {
    const category = await this.findOne(id, tenantId);

    if (dto.slug && dto.slug !== category.slug) {
      const existing = await this.categoryRepo.findOne({
        where: { tenant_id: tenantId, slug: dto.slug },
      });

      if (existing) {
        throw new BadRequestException('Category with this slug already exists');
      }
    }

    Object.assign(category, dto);
    return this.categoryRepo.save(category);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const category = await this.findOne(id, tenantId);
    await this.categoryRepo.remove(category);
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}

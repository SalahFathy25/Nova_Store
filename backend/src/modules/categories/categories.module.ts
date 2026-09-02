import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Category } from './category.entity.js';
import { CategoriesService } from './categories.service.js';
import { CategoriesController } from './categories.controller.js';
import { jwtConfig } from '../../config/jwt.config.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ secret: jwtConfig.secret, signOptions: { expiresIn: '15m' } }),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}

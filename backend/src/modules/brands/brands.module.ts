import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Brand } from './brand.entity.js';
import { BrandsService } from './brands.service.js';
import { BrandsController } from './brands.controller.js';
import { jwtConfig } from '../../config/jwt.config.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Brand]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ secret: jwtConfig.secret, signOptions: { expiresIn: '15m' } }),
  ],
  controllers: [BrandsController],
  providers: [BrandsService],
  exports: [BrandsService],
})
export class BrandsModule {}

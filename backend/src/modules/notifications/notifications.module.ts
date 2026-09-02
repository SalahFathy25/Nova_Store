import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Notification } from './notification.entity.js';
import { NotificationsService } from './notifications.service.js';
import { NotificationsController } from './notifications.controller.js';
import { jwtConfig } from '../../config/jwt.config.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ secret: jwtConfig.secret, signOptions: { expiresIn: '15m' } }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}

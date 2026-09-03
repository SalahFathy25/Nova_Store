import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DeliveryController } from './delivery.controller.js';
import { DeliveryService } from './delivery.service.js';
import { DeliveryGateway } from './delivery.gateway.js';
import { DeliveryShift } from './delivery-shift.entity.js';
import { CashLedger } from './cash-ledger.entity.js';
import { DeliveryZone } from './delivery-zone.entity.js';
import { DriverLocationHistory } from './driver-location-history.entity.js';
import { User } from '../users/user.entity.js';
import { SubOrder } from '../orders/sub-order.entity.js';
import { ParentOrder } from '../orders/parent-order.entity.js';
import { JwtStrategy } from '../../auth/strategies/jwt.strategy.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeliveryShift,
      CashLedger,
      DeliveryZone,
      DriverLocationHistory,
      User,
      SubOrder,
      ParentOrder,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN', '15m') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [DeliveryController],
  providers: [DeliveryService, DeliveryGateway, JwtStrategy],
  exports: [DeliveryService],
})
export class DeliveryModule {}

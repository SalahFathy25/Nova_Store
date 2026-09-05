var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
let DeliveryModule = class DeliveryModule {
};
DeliveryModule = __decorate([
    Module({
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
                useFactory: (config) => ({
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
], DeliveryModule);
export { DeliveryModule };
//# sourceMappingURL=delivery.module.js.map
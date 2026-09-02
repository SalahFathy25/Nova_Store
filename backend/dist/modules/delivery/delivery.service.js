var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, NotFoundException, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, In } from 'typeorm';
import { DeliveryShift } from './delivery-shift.entity.js';
import { CashLedger } from './cash-ledger.entity.js';
import { DeliveryZone } from './delivery-zone.entity.js';
import { DriverLocationHistory } from './driver-location-history.entity.js';
import { User } from '../users/user.entity.js';
import { SubOrder } from '../orders/sub-order.entity.js';
import { ParentOrder } from '../orders/parent-order.entity.js';
import { DeliveryGateway } from './delivery.gateway.js';
import * as bcrypt from 'bcryptjs';
import { randomInt } from 'crypto';
let DeliveryService = class DeliveryService {
    shiftRepo;
    cashRepo;
    zoneRepo;
    locationRepo;
    userRepo;
    subOrderRepo;
    parentOrderRepo;
    gateway;
    constructor(shiftRepo, cashRepo, zoneRepo, locationRepo, userRepo, subOrderRepo, parentOrderRepo, gateway) {
        this.shiftRepo = shiftRepo;
        this.cashRepo = cashRepo;
        this.zoneRepo = zoneRepo;
        this.locationRepo = locationRepo;
        this.userRepo = userRepo;
        this.subOrderRepo = subOrderRepo;
        this.parentOrderRepo = parentOrderRepo;
        this.gateway = gateway;
    }
    async registerDriver(tenantId, dto) {
        const existing = await this.userRepo.findOne({
            where: { tenant_id: tenantId, phone: dto.phone, role: 'driver' },
        });
        if (existing)
            throw new BadRequestException('Driver with this phone already exists');
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const driver = this.userRepo.create({
            tenant_id: tenantId,
            full_name: dto.full_name,
            phone: dto.phone,
            email: dto.email,
            password_hash: passwordHash,
            role: 'driver',
            is_active: true,
        });
        const saved = await this.userRepo.save(driver);
        const { password_hash, ...result } = saved;
        return result;
    }
    async getDriverProfile(driverId) {
        const driver = await this.userRepo.findOne({ where: { id: driverId } });
        if (!driver)
            throw new NotFoundException('Driver not found');
        const { password_hash, ...result } = driver;
        return result;
    }
    async updateDriverProfile(driverId, data) {
        const allowed = ['full_name', 'email', 'avatar_url'];
        const updates = {};
        for (const key of allowed) {
            if (data[key] !== undefined)
                updates[key] = data[key];
        }
        await this.userRepo.update(driverId, updates);
        return this.getDriverProfile(driverId);
    }
    async startShift(driverId, tenantId) {
        const active = await this.shiftRepo.findOne({
            where: { driver_id: driverId, status: In(['Online', 'On Delivery']) },
        });
        if (active)
            throw new BadRequestException('You already have an active shift');
        const shift = this.shiftRepo.create({
            driver_id: driverId,
            tenant_id: tenantId,
            status: 'Online',
            started_at: new Date(),
        });
        const saved = await this.shiftRepo.save(shift);
        this.gateway.notifyAdmins('driver:status:update', { driver_id: driverId, status: 'Online' });
        return saved;
    }
    async endShift(shiftId, driverId) {
        const shift = await this.shiftRepo.findOne({ where: { id: shiftId, driver_id: driverId } });
        if (!shift)
            throw new NotFoundException('Shift not found');
        if (shift.status === 'Offline')
            throw new BadRequestException('Shift already ended');
        shift.status = 'Offline';
        shift.ended_at = new Date();
        const saved = await this.shiftRepo.save(shift);
        this.gateway.notifyAdmins('driver:status:update', { driver_id: driverId, status: 'Offline' });
        return saved;
    }
    async getActiveShift(driverId) {
        return this.shiftRepo.findOne({
            where: { driver_id: driverId, status: In(['Online', 'On Delivery']) },
        });
    }
    async getShiftHistory(driverId, page = 1, limit = 20) {
        const [data, total] = await this.shiftRepo.findAndCount({
            where: { driver_id: driverId },
            order: { created_at: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total, page, limit, total_pages: Math.ceil(total / limit) };
    }
    async updateLocation(driverId, tenantId, dto) {
        const shift = await this.getActiveShift(driverId);
        if (!shift)
            throw new BadRequestException('No active shift. Start a shift first.');
        await this.shiftRepo.update(shift.id, {
            current_location: { lat: dto.latitude, lng: dto.longitude },
        });
        const record = this.locationRepo.create({
            driver_id: driverId,
            tenant_id: tenantId,
            sub_order_id: dto.sub_order_id ?? null,
            latitude: dto.latitude,
            longitude: dto.longitude,
            speed: dto.speed ?? null,
            heading: dto.heading ?? null,
        });
        await this.locationRepo.save(record);
        this.gateway.broadcastToAll('driver:location:update', {
            driver_id: driverId,
            latitude: dto.latitude,
            longitude: dto.longitude,
            sub_order_id: dto.sub_order_id,
            timestamp: new Date().toISOString(),
        });
        return { success: true };
    }
    async getDriverLocation(driverId) {
        const shift = await this.shiftRepo.findOne({ where: { driver_id: driverId, status: In(['Online', 'On Delivery']) } });
        if (!shift?.current_location)
            return null;
        return { driver_id: driverId, ...shift.current_location, status: shift.status };
    }
    async getSubOrderDriverLocation(subOrderId) {
        const location = await this.locationRepo.findOne({
            where: { sub_order_id: subOrderId },
            order: { created_at: 'DESC' },
        });
        return location;
    }
    async assignDriver(dto, tenantId) {
        const subOrder = await this.subOrderRepo.findOne({ where: { id: dto.sub_order_id } });
        if (!subOrder)
            throw new NotFoundException('Order not found');
        if (subOrder.delivery_status !== 'Unassigned')
            throw new BadRequestException('Order already assigned');
        const driver = await this.userRepo.findOne({ where: { id: dto.driver_id, role: 'driver' } });
        if (!driver)
            throw new NotFoundException('Driver not found');
        const otp = String(randomInt(100000, 999999));
        const otpExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        subOrder.driver_id = dto.driver_id;
        subOrder.delivery_status = 'Assigned';
        subOrder.delivery_otp = otp;
        subOrder.otp_expires_at = otpExpiry;
        await this.subOrderRepo.save(subOrder);
        const shift = await this.getActiveShift(dto.driver_id);
        if (shift) {
            await this.shiftRepo.update(shift.id, { total_orders: () => 'total_orders + 1' });
        }
        this.gateway.notifyDriver(dto.driver_id, 'order:assigned', {
            sub_order_id: dto.sub_order_id,
            otp,
        });
        this.gateway.notifyAdmins('order:assigned', {
            driver_id: dto.driver_id,
            sub_order_id: dto.sub_order_id,
        });
        return { success: true, otp };
    }
    async getDriverOrders(driverId, status) {
        const where = { driver_id: driverId };
        if (status)
            where.delivery_status = status;
        return this.subOrderRepo.find({
            where,
            relations: { parent_order: true },
            order: { created_at: 'DESC' },
        });
    }
    async getUnassignedOrders(tenantId) {
        return this.subOrderRepo.find({
            where: { delivery_status: 'Unassigned', vendor_id: IsNull() },
            relations: { parent_order: true },
            order: { created_at: 'DESC' },
        });
    }
    async updateOrderStatus(subOrderId, driverId, dto) {
        const subOrder = await this.subOrderRepo.findOne({ where: { id: subOrderId } });
        if (!subOrder)
            throw new NotFoundException('Order not found');
        if (subOrder.driver_id !== driverId)
            throw new ForbiddenException('Not your order');
        subOrder.delivery_status = dto.status;
        if (dto.status === 'Delivered') {
            subOrder.actual_delivery = new Date();
            const shift = await this.getActiveShift(driverId);
            if (shift) {
                await this.shiftRepo.update(shift.id, { total_delivered: () => 'total_delivered + 1' });
            }
        }
        if (dto.status === 'Failed') {
            const shift = await this.getActiveShift(driverId);
            if (shift) {
                await this.shiftRepo.update(shift.id, { total_failed: () => 'total_failed + 1' });
            }
        }
        if (dto.notes)
            subOrder.notes = dto.notes;
        await this.subOrderRepo.save(subOrder);
        this.gateway.notifyAdmins('order:status:update', {
            sub_order_id: subOrderId,
            delivery_status: dto.status,
        });
        return subOrder;
    }
    async verifyDeliveryOtp(subOrderId, driverId, dto) {
        const subOrder = await this.subOrderRepo.findOne({ where: { id: subOrderId } });
        if (!subOrder)
            throw new NotFoundException('Order not found');
        if (subOrder.driver_id !== driverId)
            throw new ForbiddenException('Not your order');
        if (!subOrder.otp_expires_at || subOrder.otp_expires_at < new Date()) {
            throw new BadRequestException('OTP has expired');
        }
        if (subOrder.delivery_otp !== dto.otp) {
            throw new UnauthorizedException('Invalid OTP');
        }
        subOrder.delivery_status = 'Delivered';
        subOrder.actual_delivery = new Date();
        await this.subOrderRepo.save(subOrder);
        const shift = await this.getActiveShift(driverId);
        if (shift) {
            await this.shiftRepo.update(shift.id, { total_delivered: () => 'total_delivered + 1' });
        }
        this.gateway.notifyAdmins('order:delivered', {
            sub_order_id: subOrderId,
            driver_id: driverId,
        });
        return { success: true, message: 'Delivery verified successfully' };
    }
    async submitCash(driverId, tenantId, dto) {
        const shift = await this.getActiveShift(driverId);
        if (!shift)
            throw new BadRequestException('No active shift');
        const entry = this.cashRepo.create({
            driver_id: driverId,
            shift_id: shift.id,
            tenant_id: tenantId,
            amount: dto.amount,
            type: 'collected',
            notes: dto.notes,
        });
        await this.cashRepo.save(entry);
        await this.shiftRepo.update(shift.id, {
            total_earnings: () => `total_earnings + ${dto.amount}`,
        });
        return entry;
    }
    async getCashLedger(driverId, shiftId) {
        const where = { driver_id: driverId };
        if (shiftId)
            where.shift_id = shiftId;
        return this.cashRepo.find({ where, order: { created_at: 'DESC' } });
    }
    async getCashSummary(driverId) {
        const shift = await this.getActiveShift(driverId);
        if (!shift)
            return { total_earnings: 0, total_collected: 0, pending_submissions: 0 };
        const collected = await this.cashRepo
            .createQueryBuilder('entry')
            .select('COALESCE(SUM(entry.amount), 0)', 'total')
            .where('entry.driver_id = :driverId', { driverId })
            .andWhere('entry.shift_id = :shiftId', { shiftId: shift.id })
            .andWhere('entry.type = :type', { type: 'collected' })
            .getRawOne();
        return {
            total_earnings: shift.total_earnings,
            total_collected: parseFloat(collected.total) || 0,
            pending_submissions: shift.total_earnings - (parseFloat(collected.total) || 0),
        };
    }
    async getDeliveryZones(tenantId) {
        return this.zoneRepo.find({ where: { tenant_id: tenantId, is_active: true } });
    }
    async createDeliveryZone(tenantId, data) {
        const zone = this.zoneRepo.create({ ...data, tenant_id: tenantId });
        return this.zoneRepo.save(zone);
    }
    async getAllDrivers(tenantId) {
        const drivers = await this.userRepo.find({
            where: { tenant_id: tenantId, role: 'driver' },
            order: { created_at: 'DESC' },
        });
        const driverIds = drivers.map((d) => d.id);
        const activeShifts = await this.shiftRepo.find({
            where: { driver_id: In(driverIds), status: In(['Online', 'On Delivery']) },
        });
        const shiftMap = new Map(activeShifts.map((s) => [s.driver_id, s]));
        return drivers.map((d) => {
            const { password_hash, ...driver } = d;
            const shift = shiftMap.get(d.id);
            return {
                ...driver,
                current_status: shift?.status || 'Offline',
                current_location: shift?.current_location || null,
            };
        });
    }
    async getDriverStats(driverId) {
        const totalShifts = await this.shiftRepo.count({ where: { driver_id: driverId } });
        const totalOrders = await this.subOrderRepo.count({ where: { driver_id: driverId } });
        const deliveredOrders = await this.subOrderRepo.count({
            where: { driver_id: driverId, delivery_status: 'Delivered' },
        });
        const failedOrders = await this.subOrderRepo.count({
            where: { driver_id: driverId, delivery_status: 'Failed' },
        });
        const earnings = await this.cashRepo
            .createQueryBuilder('entry')
            .select('COALESCE(SUM(entry.amount), 0)', 'total')
            .where('entry.driver_id = :driverId', { driverId })
            .getRawOne();
        return {
            total_shifts: totalShifts,
            total_orders: totalOrders,
            delivered_orders: deliveredOrders,
            failed_orders: failedOrders,
            total_earnings: parseFloat(earnings.total) || 0,
            delivery_rate: totalOrders > 0 ? ((deliveredOrders / totalOrders) * 100).toFixed(1) : '0',
        };
    }
};
DeliveryService = __decorate([
    Injectable(),
    __param(0, InjectRepository(DeliveryShift)),
    __param(1, InjectRepository(CashLedger)),
    __param(2, InjectRepository(DeliveryZone)),
    __param(3, InjectRepository(DriverLocationHistory)),
    __param(4, InjectRepository(User)),
    __param(5, InjectRepository(SubOrder)),
    __param(6, InjectRepository(ParentOrder)),
    __metadata("design:paramtypes", [Repository,
        Repository,
        Repository,
        Repository,
        Repository,
        Repository,
        Repository,
        DeliveryGateway])
], DeliveryService);
export { DeliveryService };
//# sourceMappingURL=delivery.service.js.map
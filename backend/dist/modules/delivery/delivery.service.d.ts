import { Repository } from 'typeorm';
import { DeliveryShift } from './delivery-shift.entity.js';
import { CashLedger } from './cash-ledger.entity.js';
import { DeliveryZone } from './delivery-zone.entity.js';
import { DriverLocationHistory } from './driver-location-history.entity.js';
import { User } from '../users/user.entity.js';
import { SubOrder } from '../orders/sub-order.entity.js';
import { ParentOrder } from '../orders/parent-order.entity.js';
import { DeliveryGateway } from './delivery.gateway.js';
import { UpdateLocationDto, VerifyDeliveryOtpDto, SubmitCashDto, AssignDriverDto, UpdateOrderStatusDto, RegisterDriverDto } from './dto/index.js';
export declare class DeliveryService {
    private readonly shiftRepo;
    private readonly cashRepo;
    private readonly zoneRepo;
    private readonly locationRepo;
    private readonly userRepo;
    private readonly subOrderRepo;
    private readonly parentOrderRepo;
    private readonly gateway;
    constructor(shiftRepo: Repository<DeliveryShift>, cashRepo: Repository<CashLedger>, zoneRepo: Repository<DeliveryZone>, locationRepo: Repository<DriverLocationHistory>, userRepo: Repository<User>, subOrderRepo: Repository<SubOrder>, parentOrderRepo: Repository<ParentOrder>, gateway: DeliveryGateway);
    registerDriver(tenantId: string, dto: RegisterDriverDto): Promise<any>;
    getDriverProfile(driverId: string): Promise<any>;
    updateDriverProfile(driverId: string, data: Partial<User>): Promise<any>;
    startShift(driverId: string, tenantId: string): Promise<DeliveryShift>;
    endShift(shiftId: string, driverId: string): Promise<DeliveryShift>;
    getActiveShift(driverId: string): Promise<DeliveryShift | null>;
    getShiftHistory(driverId: string, page?: number, limit?: number): Promise<{
        data: DeliveryShift[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    }>;
    updateLocation(driverId: string, tenantId: string, dto: UpdateLocationDto): Promise<{
        success: boolean;
    }>;
    getDriverLocation(driverId: string): Promise<{
        status: string;
        driver_id: string;
    } | null>;
    getSubOrderDriverLocation(subOrderId: string): Promise<DriverLocationHistory | null>;
    assignDriver(dto: AssignDriverDto, tenantId: string): Promise<{
        success: boolean;
        otp: string;
    }>;
    getDriverOrders(driverId: string, status?: string): Promise<SubOrder[]>;
    getUnassignedOrders(tenantId: string): Promise<SubOrder[]>;
    updateOrderStatus(subOrderId: string, driverId: string, dto: UpdateOrderStatusDto): Promise<SubOrder>;
    verifyDeliveryOtp(subOrderId: string, driverId: string, dto: VerifyDeliveryOtpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    submitCash(driverId: string, tenantId: string, dto: SubmitCashDto): Promise<CashLedger>;
    getCashLedger(driverId: string, shiftId?: string): Promise<CashLedger[]>;
    getCashSummary(driverId: string): Promise<{
        total_earnings: number;
        total_collected: number;
        pending_submissions: number;
    }>;
    getDeliveryZones(tenantId: string): Promise<DeliveryZone[]>;
    createDeliveryZone(tenantId: string, data: Partial<DeliveryZone>): Promise<DeliveryZone>;
    getAllDrivers(tenantId: string): Promise<any[]>;
    getDriverStats(driverId: string): Promise<{
        total_shifts: number;
        total_orders: number;
        delivered_orders: number;
        failed_orders: number;
        total_earnings: number;
        delivery_rate: string;
    }>;
}

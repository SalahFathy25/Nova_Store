import { DeliveryService } from './delivery.service.js';
import { UpdateLocationDto, VerifyDeliveryOtpDto, SubmitCashDto, AssignDriverDto, UpdateOrderStatusDto, RegisterDriverDto } from './dto/index.js';
export declare class DeliveryController {
    private readonly deliveryService;
    constructor(deliveryService: DeliveryService);
    registerDriver(tenantId: string, dto: RegisterDriverDto): Promise<any>;
    getAllDrivers(tenantId: string): Promise<any[]>;
    getMyProfile(driverId: string): Promise<any>;
    updateMyProfile(driverId: string, data: Partial<RegisterDriverDto>): Promise<any>;
    getDriverStats(driverId: string): Promise<{
        total_shifts: number;
        total_orders: number;
        delivered_orders: number;
        failed_orders: number;
        total_earnings: number;
        delivery_rate: string;
    }>;
    startShift(driverId: string, tenantId: string): Promise<import("./delivery-shift.entity.js").DeliveryShift>;
    endShift(shiftId: string, driverId: string): Promise<import("./delivery-shift.entity.js").DeliveryShift>;
    getActiveShift(driverId: string): Promise<import("./delivery-shift.entity.js").DeliveryShift | null>;
    getShiftHistory(driverId: string, page: number, limit: number): Promise<{
        data: import("./delivery-shift.entity.js").DeliveryShift[];
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
    getSubOrderDriverLocation(subOrderId: string): Promise<import("./driver-location-history.entity.js").DriverLocationHistory | null>;
    assignDriver(tenantId: string, dto: AssignDriverDto): Promise<{
        success: boolean;
        otp: string;
    }>;
    getMyOrders(driverId: string, status?: string): Promise<import("../orders/sub-order.entity.js").SubOrder[]>;
    getUnassignedOrders(tenantId: string): Promise<import("../orders/sub-order.entity.js").SubOrder[]>;
    updateOrderStatus(subOrderId: string, driverId: string, dto: UpdateOrderStatusDto): Promise<import("../orders/sub-order.entity.js").SubOrder>;
    verifyDeliveryOtp(subOrderId: string, driverId: string, dto: VerifyDeliveryOtpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    submitCash(driverId: string, tenantId: string, dto: SubmitCashDto): Promise<import("./cash-ledger.entity.js").CashLedger>;
    getCashLedger(driverId: string, shiftId?: string): Promise<import("./cash-ledger.entity.js").CashLedger[]>;
    getCashSummary(driverId: string): Promise<{
        total_earnings: number;
        total_collected: number;
        pending_submissions: number;
    }>;
    getDeliveryZones(tenantId: string): Promise<import("./delivery-zone.entity.js").DeliveryZone[]>;
    createDeliveryZone(tenantId: string, data: Partial<any>): Promise<import("./delivery-zone.entity.js").DeliveryZone>;
}

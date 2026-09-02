export declare class StartShiftDto {
}
export declare class UpdateLocationDto {
    latitude: number;
    longitude: number;
    speed?: number;
    heading?: number;
    sub_order_id?: string;
}
export declare class VerifyDeliveryOtpDto {
    otp: string;
}
export declare class SubmitCashDto {
    amount: number;
    notes?: string;
}
export declare class AssignDriverDto {
    driver_id: string;
    sub_order_id: string;
}
export declare class UpdateOrderStatusDto {
    status: string;
    notes?: string;
}
export declare class RegisterDriverDto {
    full_name: string;
    phone: string;
    password: string;
    email?: string;
    vehicle_type?: string;
    vehicle_plate?: string;
    license_number?: string;
}

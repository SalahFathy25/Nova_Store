export declare class CreateAddressDto {
    label?: string;
    full_address: string;
    street?: string;
    building?: string;
    floor?: string;
    apartment?: string;
    landmark?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    latitude?: number;
    longitude?: number;
    is_default?: boolean;
}
declare const UpdateAddressDto_base: import("@nestjs/common").Type<Partial<CreateAddressDto>>;
export declare class UpdateAddressDto extends UpdateAddressDto_base {
}
export {};

import { AddressesService } from './addresses.service.js';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto.js';
export declare class AddressesController {
    private readonly addressesService;
    constructor(addressesService: AddressesService);
    findAll(tenantId: string, userId: string): Promise<import("./user-address.entity.js").UserAddress[]>;
    findOne(id: string, tenantId: string, userId: string): Promise<import("./user-address.entity.js").UserAddress>;
    create(dto: CreateAddressDto, tenantId: string, userId: string): Promise<import("./user-address.entity.js").UserAddress>;
    update(id: string, dto: UpdateAddressDto, tenantId: string, userId: string): Promise<import("./user-address.entity.js").UserAddress>;
    remove(id: string, tenantId: string, userId: string): Promise<{
        message: string;
    }>;
    setDefault(id: string, tenantId: string, userId: string): Promise<import("./user-address.entity.js").UserAddress>;
}

import { Repository } from 'typeorm';
import { UserAddress } from './user-address.entity.js';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto.js';
export declare class AddressesService {
    private readonly addressRepo;
    constructor(addressRepo: Repository<UserAddress>);
    getAll(tenantId: string, userId: string): Promise<UserAddress[]>;
    getOne(tenantId: string, userId: string, id: string): Promise<UserAddress>;
    create(tenantId: string, userId: string, dto: CreateAddressDto): Promise<UserAddress>;
    update(tenantId: string, userId: string, id: string, dto: UpdateAddressDto): Promise<UserAddress>;
    delete(tenantId: string, userId: string, id: string): Promise<void>;
    setDefault(tenantId: string, userId: string, id: string): Promise<UserAddress>;
    private unsetDefaults;
}

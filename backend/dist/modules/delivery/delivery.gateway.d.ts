import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity.js';
import { SubOrder } from '../orders/sub-order.entity.js';
export declare class DeliveryGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    private readonly userRepo;
    private readonly subOrderRepo;
    server: Server;
    private driverSockets;
    private adminSockets;
    constructor(jwtService: JwtService, userRepo: Repository<User>, subOrderRepo: Repository<SubOrder>);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleLocationUpdate(client: Socket, data: {
        latitude: number;
        longitude: number;
        sub_order_id?: string;
    }): Promise<void>;
    handleDriverStatus(client: Socket, data: {
        status: string;
    }): Promise<void>;
    handleOrderAssigned(client: Socket, data: {
        driver_id: string;
        sub_order_id: string;
    }): Promise<void>;
    notifyDriver(driverId: string, event: string, data: any): void;
    notifyAdmins(event: string, data: any): void;
    broadcastToAll(event: string, data: any): void;
}

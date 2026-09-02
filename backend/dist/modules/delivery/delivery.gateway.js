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
import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity.js';
import { SubOrder } from '../orders/sub-order.entity.js';
let DeliveryGateway = class DeliveryGateway {
    jwtService;
    userRepo;
    subOrderRepo;
    server;
    driverSockets = new Map();
    adminSockets = new Set();
    constructor(jwtService, userRepo, subOrderRepo) {
        this.jwtService = jwtService;
        this.userRepo = userRepo;
        this.subOrderRepo = subOrderRepo;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token || client.handshake.query?.token;
            if (!token) {
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token);
            const user = await this.userRepo.findOne({ where: { id: payload.sub } });
            if (!user) {
                client.disconnect();
                return;
            }
            client.data.user = user;
            if (user.role === 'driver') {
                this.driverSockets.set(user.id, client.id);
            }
            else if (user.role === 'admin' || user.role === 'vendor_admin') {
                this.adminSockets.add(client.id);
            }
        }
        catch {
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const user = client.data?.user;
        if (user?.role === 'driver') {
            this.driverSockets.delete(user.id);
        }
        this.adminSockets.delete(client.id);
    }
    async handleLocationUpdate(client, data) {
        const user = client.data.user;
        if (!user || user.role !== 'driver')
            return;
        this.server.emit('driver:location:update', {
            driver_id: user.id,
            latitude: data.latitude,
            longitude: data.longitude,
            sub_order_id: data.sub_order_id,
            timestamp: new Date().toISOString(),
        });
    }
    async handleDriverStatus(client, data) {
        const user = client.data.user;
        if (!user || user.role !== 'driver')
            return;
        this.server.emit('driver:status:update', {
            driver_id: user.id,
            status: data.status,
            timestamp: new Date().toISOString(),
        });
    }
    async handleOrderAssigned(client, data) {
        const driverSocketId = this.driverSockets.get(data.driver_id);
        if (driverSocketId) {
            this.server.to(driverSocketId).emit('order:assigned', data);
        }
    }
    notifyDriver(driverId, event, data) {
        const socketId = this.driverSockets.get(driverId);
        if (socketId) {
            this.server.to(socketId).emit(event, data);
        }
    }
    notifyAdmins(event, data) {
        this.adminSockets.forEach((socketId) => {
            this.server.to(socketId).emit(event, data);
        });
    }
    broadcastToAll(event, data) {
        this.server.emit(event, data);
    }
};
__decorate([
    WebSocketServer(),
    __metadata("design:type", Server)
], DeliveryGateway.prototype, "server", void 0);
__decorate([
    SubscribeMessage('driver:location'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], DeliveryGateway.prototype, "handleLocationUpdate", null);
__decorate([
    SubscribeMessage('driver:status'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], DeliveryGateway.prototype, "handleDriverStatus", null);
__decorate([
    SubscribeMessage('order:assigned'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], DeliveryGateway.prototype, "handleOrderAssigned", null);
DeliveryGateway = __decorate([
    WebSocketGateway({
        cors: { origin: '*' },
        namespace: '/delivery',
    }),
    __param(1, InjectRepository(User)),
    __param(2, InjectRepository(SubOrder)),
    __metadata("design:paramtypes", [JwtService,
        Repository,
        Repository])
], DeliveryGateway);
export { DeliveryGateway };
//# sourceMappingURL=delivery.gateway.js.map
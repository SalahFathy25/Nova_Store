import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity.js';
import { SubOrder } from '../orders/sub-order.entity.js';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/delivery',
})
export class DeliveryGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private driverSockets = new Map<string, string>(); // driverId -> socketId
  private adminSockets = new Set<string>();

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(SubOrder) private readonly subOrderRepo: Repository<SubOrder>,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.query?.token;
      if (!token) {
        client.disconnect();
        return;
      }
      const payload = this.jwtService.verify(token as string);
      const user = await this.userRepo.findOne({ where: { id: payload.sub } });
      if (!user) {
        client.disconnect();
        return;
      }
      client.data.user = user;

      if (user.role === 'driver') {
        this.driverSockets.set(user.id, client.id);
      } else if (user.role === 'admin' || user.role === 'vendor_admin') {
        this.adminSockets.add(client.id);
      }
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const user = client.data?.user;
    if (user?.role === 'driver') {
      this.driverSockets.delete(user.id);
    }
    this.adminSockets.delete(client.id);
  }

  @SubscribeMessage('driver:location')
  async handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { latitude: number; longitude: number; sub_order_id?: string },
  ) {
    const user = client.data.user;
    if (!user || user.role !== 'driver') return;

    this.server.emit('driver:location:update', {
      driver_id: user.id,
      latitude: data.latitude,
      longitude: data.longitude,
      sub_order_id: data.sub_order_id,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('driver:status')
  async handleDriverStatus(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { status: string },
  ) {
    const user = client.data.user;
    if (!user || user.role !== 'driver') return;

    this.server.emit('driver:status:update', {
      driver_id: user.id,
      status: data.status,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('order:assigned')
  async handleOrderAssigned(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { driver_id: string; sub_order_id: string },
  ) {
    const driverSocketId = this.driverSockets.get(data.driver_id);
    if (driverSocketId) {
      this.server.to(driverSocketId).emit('order:assigned', data);
    }
  }

  notifyDriver(driverId: string, event: string, data: any) {
    const socketId = this.driverSockets.get(driverId);
    if (socketId) {
      this.server.to(socketId).emit(event, data);
    }
  }

  notifyAdmins(event: string, data: any) {
    this.adminSockets.forEach((socketId) => {
      this.server.to(socketId).emit(event, data);
    });
  }

  broadcastToAll(event: string, data: any) {
    this.server.emit(event, data);
  }
}

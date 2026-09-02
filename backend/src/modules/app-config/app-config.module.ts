import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../stores/store.entity.js';
import { AppConfigController } from './app-config.controller.js';
import { AppConfigService } from './app-config.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  controllers: [AppConfigController],
  providers: [AppConfigService],
})
export class AppConfigModule {}

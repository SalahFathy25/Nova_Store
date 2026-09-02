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
import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { AppConfigService } from './app-config.service.js';
let AppConfigController = class AppConfigController {
    appConfigService;
    constructor(appConfigService) {
        this.appConfigService = appConfigService;
    }
    async getConfig(req) {
        return this.appConfigService.getConfig(req.tenantId);
    }
};
__decorate([
    Get(),
    ApiOperation({ summary: 'Get app configuration for the current tenant' }),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppConfigController.prototype, "getConfig", null);
AppConfigController = __decorate([
    ApiTags('App Config'),
    ApiSecurity('tenant-id'),
    Controller('api/v1/app-config'),
    __metadata("design:paramtypes", [AppConfigService])
], AppConfigController);
export { AppConfigController };
//# sourceMappingURL=app-config.controller.js.map
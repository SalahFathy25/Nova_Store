var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DevSmsService_1;
import { Injectable, Logger } from '@nestjs/common';
let DevSmsService = DevSmsService_1 = class DevSmsService {
    logger = new Logger(DevSmsService_1.name);
    async sendOtp(phone, code) {
        this.logger.log(`[DEV SMS] OTP for ${phone}: ${code}`);
    }
};
DevSmsService = DevSmsService_1 = __decorate([
    Injectable()
], DevSmsService);
export { DevSmsService };
//# sourceMappingURL=dev-sms.service.js.map
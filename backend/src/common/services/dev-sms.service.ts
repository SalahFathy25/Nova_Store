import { Injectable, Logger } from '@nestjs/common';
import { SmsService } from './sms.service.js';

@Injectable()
export class DevSmsService implements SmsService {
  private readonly logger = new Logger(DevSmsService.name);

  async sendOtp(phone: string, code: string): Promise<void> {
    this.logger.log(`[DEV SMS] OTP for ${phone}: ${code}`);
  }
}

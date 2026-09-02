import { SmsService } from './sms.service.js';
export declare class DevSmsService implements SmsService {
    private readonly logger;
    sendOtp(phone: string, code: string): Promise<void>;
}

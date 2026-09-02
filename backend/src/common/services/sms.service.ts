import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class SmsService {
  abstract sendOtp(phone: string, code: string): Promise<void>;
}

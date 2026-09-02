import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../stores/store.entity.js';

@Injectable()
export class AppConfigService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
  ) {}

  async getConfig(tenantId: string) {
    const store = await this.storeRepo.findOne({ where: { id: tenantId } });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const config = store.configurations || {};
    const branding = store.branding || {};

    return {
      store: {
        id: store.id,
        name: store.name,
        domain: store.domain,
      },
      branding: {
        primary_color: branding.primary_color || '#1A1A1A',
        secondary_color: branding.secondary_color || '#D4AF37',
        font_family: branding.font_family || 'Cairo',
        logo_url: branding.logo_url || null,
        splash_background: branding.splash_background || null,
      },
      auth: config.auth || {
        email_enabled: true,
        phone_enabled: true,
        otp_enabled: true,
        google_login_enabled: false,
        apple_login_enabled: false,
        facebook_login_enabled: false,
        password_min_length: 8,
        require_email_verification: false,
      },
      texts: config.texts || {
        app_name: store.name,
        tagline: 'Your premium shopping destination',
        login_title: 'Welcome Back',
        login_subtitle: 'Sign in to continue shopping',
        register_title: 'Create Account',
        register_subtitle: 'Join us and start shopping',
        otp_title: 'Verify Your Phone',
        otp_subtitle: 'Enter the code sent to your phone',
      },
      features: {
        currency: config.currency || 'EGP',
        locale: config.locale || 'ar',
        tax_rate: config.tax_rate || 0.14,
        dark_mode_enabled: config.dark_mode_enabled ?? false,
        language_switcher_enabled: config.language_switcher_enabled ?? true,
        returns_enabled: config.returns_enabled ?? true,
        loyalty_program_enabled: config.loyalty_program_enabled ?? false,
      },
    };
  }
}

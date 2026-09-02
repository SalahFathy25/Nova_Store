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
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../stores/store.entity.js';
let AppConfigService = class AppConfigService {
    storeRepo;
    constructor(storeRepo) {
        this.storeRepo = storeRepo;
    }
    async getConfig(tenantId) {
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
};
AppConfigService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Store)),
    __metadata("design:paramtypes", [Repository])
], AppConfigService);
export { AppConfigService };
//# sourceMappingURL=app-config.service.js.map
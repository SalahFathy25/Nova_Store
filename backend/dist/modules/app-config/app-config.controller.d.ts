import { AppConfigService } from './app-config.service.js';
export declare class AppConfigController {
    private readonly appConfigService;
    constructor(appConfigService: AppConfigService);
    getConfig(req: any): Promise<{
        store: {
            id: string;
            name: string;
            domain: string;
        };
        branding: {
            primary_color: any;
            secondary_color: any;
            font_family: any;
            logo_url: any;
            splash_background: any;
        };
        auth: any;
        texts: any;
        features: {
            currency: any;
            locale: any;
            tax_rate: any;
            dark_mode_enabled: any;
            language_switcher_enabled: any;
            returns_enabled: any;
            loyalty_program_enabled: any;
        };
    }>;
}

import { Repository } from 'typeorm';
import { Store } from '../stores/store.entity.js';
export declare class AppConfigService {
    private readonly storeRepo;
    constructor(storeRepo: Repository<Store>);
    getConfig(tenantId: string): Promise<{
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

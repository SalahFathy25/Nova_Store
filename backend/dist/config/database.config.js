import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const getDatabaseConfig = () => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'nova_commerce',
    entities: [join(__dirname, '..', 'modules', '**', '*.entity.{ts,js}')],
    synchronize: process.env.APP_ENV === 'development',
    logging: process.env.APP_ENV === 'development',
    ssl: process.env.APP_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
//# sourceMappingURL=database.config.js.map
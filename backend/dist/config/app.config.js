export const appConfig = {
    port: parseInt(process.env.APP_PORT || '3000', 10),
    env: process.env.APP_ENV || 'development',
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['*'],
    isProduction: process.env.APP_ENV === 'production',
};
//# sourceMappingURL=app.config.js.map
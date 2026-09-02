export const jwtConfig = {
    secret: process.env.JWT_SECRET || 'nova-commerce-secret-key',
    signOptions: { expiresIn: '15m' },
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'nova-commerce-refresh-secret',
    refreshExpiresIn: '7d',
};
//# sourceMappingURL=jwt.config.js.map
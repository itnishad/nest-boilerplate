export const helmetConfigForProd = {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Required for Swagger UI
        },
    },
    frameguard: { action: 'deny' as const },
    hidePoweredBy: true,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
    noSniff: true,
    dnsPrefetchControl: { allow: false },
    referrerPolicy: {
        policy: 'strict-origin-when-cross-origin' as const,
    },
};

export const helmetConfigForDev = {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            scriptSrc: ["'self'"],
        },
    },
    frameguard: { action: 'deny' as const },
    hidePoweredBy: true,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
    noSniff: true,
    dnsPrefetchControl: { allow: false },
    referrerPolicy: {
        policy: 'strict-origin-when-cross-origin' as const,
    },
};
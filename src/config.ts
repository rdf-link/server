export const config = {
    data: process.env.DATA ?? '<https://example.org/> <x> <y> .',
    domain: process.env.DOMAIN ?? 'https://example.org',
    environment: process.env.NODE_ENV ?? 'production',
    port: process.env.PORT ?? 3000,
}
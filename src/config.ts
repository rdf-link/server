export const config = {
    acceptedMediaTypes: [ "text/turtle", "text/*", "*/*" ],
    data: process.env.DATA ?? '<https://example.org/> <x> <y> .',
    dataFormat: process.env.DATA_FORMAT ?? 'TURTLE',
    domain: process.env.DOMAIN ?? 'https://example.org',
    environment: process.env.NODE_ENV ?? 'production',
    port: process.env.PORT ?? 3000,
}
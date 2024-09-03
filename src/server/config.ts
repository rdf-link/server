export const config = {
    acceptedMediaTypes: [ "text/turtle", "text/*", "*/*" ],
    data: process.env.DATA ?? '<https://example.org/> <x> <y> .',
    dataFormat: process.env.DATA_FORMAT ?? 'TURTLE',
    domain: new URL(process.env.DOMAIN ?? 'https://example.org'),
    environment: process.env.NODE_ENV ?? 'production',
}

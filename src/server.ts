import { createServer } from 'node:http';

import { DataSource } from './data/datasource.js'

const DOMAIN = `${process.env.HOST ?? 'localhost'}`;
const PORT = process.env.PORT ?? 3000;

const server = createServer(async (request, response) => {
    // TODO make it content negotiable
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/turtle');

    // TODO add a request parser
    // Check for accept header
    // Check for query parameters
    // Check for url
    const datasource = new DataSource();

    // Query datasource and pipe to response
    (await datasource.query(request))
        .pipe(response)
        .on('error', (error) => {
            console.error('Error processing data:', error);
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.end('Internal Server Error');
        });
});

server.listen(PORT, () => {
    console.log(`Node environment: ${process.env.NODE_ENV}`);
    console.log(`Server running: http://${DOMAIN}:${PORT}/`);
});

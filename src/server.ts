import { createServer } from 'node:http';

import { config } from './config.js'
import { DataSource } from './data/datasource.js'
import { Readable } from 'node:stream';

const server = createServer(async (request, response) => {
    // TODO error handling
    // TODO make it content negotiable
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/turtle');

    // TODO add a request parser
    // Check for accept header
    // Check for query parameters
    // Check for url
    const datasource = new DataSource(Readable.from(config.data), new URL(config.domain));

    // Query datasource and pipe to response
    (await datasource.query(request))
        .pipe(response)
        .on('error', (error) => {
            console.error('Error processing data:', error);
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.end('Internal Server Error');
        });
});

server.listen(config.port, () => {
    console.log(`Node environment: ${config.environment}`);
    console.log(`Server running: http://${process.env.HOST ?? 'localhost'}:${config.port}/`);
});

import { createServer } from 'node:http';

import { config } from './config.js';
import { HTTP } from './constants.js';
import { DataSource } from './data/datasource.js';
import { Readable } from 'node:stream';


const server = createServer(async (request, response) => {
    // Handle allowed HTTP methods
    const ALLOW = [ HTTP.REQUEST_METHOD.GET, HTTP.REQUEST_METHOD.HEAD, HTTP.REQUEST_METHOD.OPTIONS];
    response.setHeader('Allow', ALLOW.join(', '));
    if (!ALLOW.includes(request.method || "")) {
        response.writeHead(HTTP.STATUS.CLIENT_ERROR.METHOD_NOT_ALLOWED);
        return response.end();
    }

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

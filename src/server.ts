import { createServer } from 'node:http';

import { DataSource } from './data/datasource.js'

import { PORT } from './config.js';

const server = createServer(async (request, response) => {
    // TODO make it content negotiable
    response.writeHead(200, { 'Content-Type': 'text/turtle' });

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
    console.log(`Server running at http://${process.env.HOST ?? 'localhost'}:${PORT}/`);
});

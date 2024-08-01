import { createServer } from 'node:http';

import { data } from './data.js';
import { parse } from './parse.js';
import { describe } from './query.js';
import { writer } from './writer.js';


import { DOMAIN, PORT } from './config.js';

import { DataFactory } from 'n3';

const server = createServer(async (request, response) => {
    const term = DataFactory.namedNode(new URL(`${request.url}`, DOMAIN).href);

    // Set the response header
    response.writeHead(200, { 'Content-Type': 'text/turtle' });

    // TODO consider parse, describe and writer under data
    // TODO make it so that the query is configurable
    // Readable RDF turtle stream -> parse as quads -> filter quads -> write response 
    data()
        .pipe(parse())
        .pipe(describe(term))
        .pipe(writer())
        .pipe(response)
        .on('error', (error) => {
            console.error('Error processing data:', error);
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.end('Internal Server Error');
        });
});

server.listen(PORT, () => {
    console.log(`Server running at http://${process.env.HOST}:${PORT}/`);
});

import { createServer } from 'node:http';
import { Readable } from 'node:stream';

import { quads } from './quads.js';
import { describe } from './describe.js';

import { DOMAIN, PORT } from './config.js';

import { DataFactory, StreamWriter } from 'n3';

const server = createServer(async (request, response) => {
    const term = DataFactory.namedNode(new URL(`${request.url}`, DOMAIN).href);

    // Create a stream writer that writes Turtle
    // TODO the stream writer is retrieved depending on the content type requested (accept header)
    // First accept text/turtle and text/html
    const writer = new StreamWriter({
        format: 'TURTLE',
        prefixes: { '': DOMAIN }
    });

    // Set the response header
    response.writeHead(200, { 'Content-Type': 'text/turtle' });

    //const readStream = await data(url);


    // Create a readable stream from quad iterable
    Readable
        .from(describe(quads(), term))
        .pipe(writer)
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

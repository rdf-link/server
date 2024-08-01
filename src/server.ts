import { createServer } from 'node:http';

import { data } from './data.js';
import { streamDescribe } from './describe.js';

import { DOMAIN, PORT } from './config.js';

import { DataFactory, StreamParser, StreamWriter } from 'n3';

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

    // Create a readable stream of quads
    data()
        .pipe(streamDescribe(term))
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

import { createServer } from 'node:http';
import { Readable } from 'node:stream'
import { StreamParser, StreamWriter } from 'n3';
import { x } from './data/x.js';

const port = 3000;

const server = createServer((req, res) => {
    // Create a readable stream from the turtle string
    const readableStream = Readable.from(x);
    const parser = new StreamParser();

    // Create a stream writer that writes Turtle
    const writer = new StreamWriter({
        format: 'TURTLE',
        prefixes: {
            ex: 'http://example.org/'
        }
    });

    // Set the response header
    res.writeHead(200, { 'Content-Type': 'text/turtle' });

    readableStream
        .pipe(parser)
        .pipe(writer)
        .pipe(res)
        .on('error', (error) => {
            console.error('Error processing data:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

import { createServer } from 'node:http';
import { StreamWriter } from 'n3';
import { data } from './data.js';

const port = 3000;

const server = createServer((request, response) => {
    const url = new URL(`http://${process.env.HOST ?? 'localhost'}${request.url}`); 

    // Create a stream writer that writes Turtle
    // TODO create stream writer depending on accept header
    const writer = new StreamWriter({
        format: 'TURTLE',
        prefixes: {
            ex: 'http://example.org/'
        }
    });

    // Set the response header
    response.writeHead(200, { 'Content-Type': 'text/turtle' });

    data(url)
        .pipe(writer)
        .pipe(response)
        .on('error', (error) => {
            console.error('Error processing data:', error);
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.end('Internal Server Error');
        });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

import { createServer } from 'node:http';
import { DataFactory, Writer } from 'n3';

const port = 3000;

const server = createServer((req, res) => {
    // Set the response header
    res.writeHead(200, { 'Content-Type': 'text/turtle' });

    // Create a writer that writes Turtle
    const writer = new Writer({
        format: 'Turtle',
        prefixes: {
            ex: 'http://example.org/'
        }
    });

    // Create some sample quads
    const quads = [
        DataFactory.quad(
            DataFactory.namedNode('http://example.org/x'),
            DataFactory.namedNode('http://example.org/y'),
            DataFactory.namedNode('http://example.org/z0')
        ),
        DataFactory.quad(
            DataFactory.namedNode('http://example.org/x'),
            DataFactory.namedNode('http://example.org/y'),
            DataFactory.namedNode('http://example.org/z1')
        ),
        DataFactory.quad(
            DataFactory.namedNode('http://example.org/x'),
            DataFactory.namedNode('http://example.org/y'),
            DataFactory.literal('z')
        )
    ];

    // Write the quads and get the result as a string
    writer.addQuads(quads);
    writer.end((error, result) => {
        if (error) {
            console.error('Error serializing quads:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('An error occurred while processing the request');
        } else {
            // Write the entire Turtle string to the response and end it
            res.end(result);
        }
    });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

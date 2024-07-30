import { Readable } from "node:stream";
import { DataFactory, Parser, Store } from 'n3';


// TODO do a readable from a data function that returns an iterable of quads
// It takes the request and response as parameters
// 
// If subject is not present return an empty iterable
// If subject is present return DESCRIBE

// TODO the stream writer is retrieved depending on the content type requested (accept header)
// First accept text/turtle and text/html

const x = `
<x> <y> 'z' .
<a> <b> <c>, <d> .
`;

export function data(url: URL): Readable {
    const parser = new Parser({ baseIRI: 'http://example.org/', format: 'Turtle' });
    const store = new Store(parser.parse((x)));

    if (url.pathname == '/test') {
        throw new Error("TEST")
    }

    // Create a readable stream from the turtle string
    return Readable.from(store.match(DataFactory.namedNode('http://example.org/')));
}
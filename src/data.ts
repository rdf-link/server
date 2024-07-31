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
<x1> 
    <y1> 'z1', 'z2' ;
    <y2> <z1>, <z2> .
<a> <b> <c>, <d> .
`;

async function* concatStreams(readables: Readable[]) {
    for (const readable of readables) {
        for await (const chunk of readable) { yield chunk }
    }
}

export async function data(url: URL): Promise<Readable> {
    const parser = new Parser({ baseIRI: 'http://example.org/', format: 'Turtle' });
    const store = new Store(parser.parse((x)));

    if (url.pathname == '/test') {
        throw new Error("TEST")
    }

    const iterable = await concatStreams([
        store.match(DataFactory.namedNode('http://example.org/x')),
        store.match(DataFactory.namedNode('http://example.org/x1'))
    ].map(x => Readable.from(x)))

    // Create a readable stream from the turtle string
    return Readable.from(iterable);
}
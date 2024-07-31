import type { Term } from "@rdfjs/types";
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
<a> <b> <c>, <d>, <x> .
`;

function* describe(store: Store, term: Term) {
    const blanks = [];
    for (const quad of store) {
        if (quad.subject.equals(term)) {
            yield quad
        }
        if (quad.object.equals(term)) {
            yield quad
        }
        // TODO check for blanknodes
        // keep an array of subjects to check if the blank existed in what's been gone through
    }
}

export async function data(url: URL): Promise<Readable> {
    // TODO try with streaming parser
    const parser = new Parser({ baseIRI: 'http://example.org/', format: 'Turtle' });
    const store = new Store(parser.parse((x)));

    if (url.pathname == '/test') {
        throw new Error("TEST")
    }

    // async function* concatStreams(readables: Readable[]) {
    //     for (const readable of readables) {
    //         for await (const chunk of readable) { yield chunk }
    //     }
    // }
    // const iterable = await concatStreams([
    //     store.match(DataFactory.namedNode('http://example.org/x')),
    //     store.match(DataFactory.namedNode('http://example.org/x1'))
    // ].map(x => Readable.from(x)))

    const iterable = describe(store, DataFactory.namedNode('http://example.org/x'));

    // Create a readable stream from the turtle string
    return Readable.from(iterable);
}
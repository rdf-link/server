import { StreamParser } from "n3";
import { Readable, Stream, EventEmitter } from "node:stream";
import { DOMAIN } from "./config.js";

// TODO fix up the type import should be rdfjs/types but here n3 Quads have toJson
import type { Quad } from "n3";

const x = `
<> <bla> 'bla' .
<x> <y> 'z' .
<x/d> <bla> 'bla' .
<x1> 
    <y1> 'z1', 'z2' ;
    <y2> <z1>, <z2> .
<a> <b> <c>, <d>, <x> .
`;



export function data(): StreamParser<Quad> {
    const parser = new StreamParser({ baseIRI: DOMAIN, format: 'Turtle' });
    const y = Readable.from(x);
    return y.pipe(parser);
}
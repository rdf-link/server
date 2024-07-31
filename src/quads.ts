import type { Quad } from "@rdfjs/types";

import { Parser } from 'n3';

import { DOMAIN } from './config.js';


const x = `
<> <bla> 'bla' .
<x> <y> 'z' .
<x/d> <bla> 'bla' .
<x1> 
    <y1> 'z1', 'z2' ;
    <y2> <z1>, <z2> .
<a> <b> <c>, <d>, <x> .
`;

export async function quads(): Promise<Iterable<Quad>> {
    const parser = new Parser({ baseIRI: DOMAIN, format: 'Turtle' });

    return parser.parse((x));
}

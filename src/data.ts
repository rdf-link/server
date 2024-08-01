import { Readable } from "node:stream";

const x = `
<> <bla> 'bla' .
<x> <y> 'z' .
<x/d> <bla> 'bla' .
<x1> 
    <y1> 'z1', 'z2' ;
    <y2> <z1>, <z2> .
<a> <b> <c>, <d>, <x> .
`;

// TODO Make data source configurable
export function data(): Readable {
    return Readable.from(x);
}
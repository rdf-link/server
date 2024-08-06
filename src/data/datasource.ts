import { IncomingMessage } from "node:http";
import { Readable, Transform, Writable } from "node:stream";

import { DataFactory, StreamParser, StreamWriter } from "n3";

export class DataSource {
    static #domain = `http://${process.env.HOST ?? 'localhost'}/`;
    static #format = 'Turtle';

    static async #data(): Promise<Readable> {
        console.log("read data source")
        return Readable.from(`
<> <bla> 'bla' .
<x> <y> 'z' .
<x/d> <bla> 'bla' .
<x1> 
    <y1> 'z1', 'z2' ;
    <y2> <z1>, <z2> .
<a> <b> <c>, <d>, <x> .
`);
    }

    static #describe(request: IncomingMessage): Transform {
        const term = DataFactory.namedNode(new URL(`${request.url}`, DataSource.#domain).href);
    
        return new Transform({
            // Make sure chunks are considered as object instead of buffers
            objectMode: true,
    
            transform(quad, encoding, callback) {
                if (quad.subject.equals(term)) {
                    callback(null, quad);
                }
                else if (quad.object.equals(term)) {
                    callback(null, quad);
                }
                else {
                    callback(null, undefined);
                }
            },
        });
    }

    static #parse(): Transform {
        return new StreamParser({ baseIRI: DataSource.#domain, format: DataSource.#format });
    }

    static #write(): Transform {
        return new StreamWriter({format: DataSource.#format, prefixes: { '': DataSource.#domain }});
    }

    async query(request: IncomingMessage): Promise<Writable> {
        // TODO make it so that the query is configurable
        // Readable RDF turtle stream -> parse as quads -> filter quads -> write response 
        return (await DataSource.#data())
            .pipe(DataSource.#parse())
            .pipe(DataSource.#describe(request))
            .pipe(DataSource.#write());
    }
}
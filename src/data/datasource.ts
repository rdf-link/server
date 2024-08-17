import { IncomingMessage } from "node:http";
import { Readable, Transform, Writable } from "node:stream";

import { DataFactory, StreamParser, StreamWriter } from "n3";

export class DataSource {
    #data;
    #domain;
    static #format = 'Turtle';

    constructor(data: Readable, domain: URL) {
        this.#data = data;
        this.#domain = domain
    }

    #describe(request: IncomingMessage): Transform {
        const term = DataFactory.namedNode(new URL(`${request.url}`, this.#domain).href);
    
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

    #parse(): Transform {
        return new StreamParser({ baseIRI: this.#domain.href, format: DataSource.#format });
    }

    #write(): Transform {
        return new StreamWriter({format: DataSource.#format, prefixes: { '': this.#domain.href }});
    }

    async query(request: IncomingMessage): Promise<Writable> {
        // TODO make it so that the query is configurable
        // Readable RDF turtle stream -> parse as quads -> filter quads -> write response 
        return (await this.#data)
            .pipe(this.#parse())
            .pipe(this.#describe(request))
            .pipe(this.#write());
    }
}
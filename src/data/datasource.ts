import { IncomingMessage } from "node:http";
import { Readable, Transform, Writable } from "node:stream";

import { DataFactory, StreamParser, StreamWriter } from "n3";

export class DataSource {
    #data;
    #domain;

    constructor(data: Readable, domain: URL) {
        this.#data = data;
        this.#domain = domain
    }

    #describe(request: IncomingMessage): Transform {
        const term = DataFactory.namedNode(new URL(`${request.url}`, this.#domain.href).href);
    
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
        return new StreamParser({ format: 'TURTLE' });
    }

    #write(format: string): Transform {
        return new StreamWriter({format, prefixes: { '': this.#domain.href }});
    }

    async query(request: IncomingMessage): Promise<Writable> {
        // TODO make it so that the query is configurable
        // Readable RDF turtle stream -> parse as quads -> filter quads -> write response 
        // parse request to see acceptable representation default to turtle
        const accept = 'TURTLE'
        return (await this.#data)
            .pipe(this.#parse())
            .pipe(this.#describe(request))
            .pipe(this.#write(accept));
    }
}
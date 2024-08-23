import { IncomingMessage } from "node:http";
import { Readable, Transform, Writable } from "node:stream";

import { DataFactory, Store, StreamParser, StreamWriter } from "n3";

export class InMemoryDataStore {
    #domain;
    #store;

    constructor(data: Readable, format: string, domain: URL) {
        this.#domain = domain
        this.#store = new Store();
        data
            .pipe(new StreamParser({ format }))
            .on('data', (quad) => {
                this.#store.add(quad);
            });
    }

    #data(): Readable {
        // Create a readable stream of quads from the store
        const quads = this.#store.getQuads(null, null, null, null);
        let index = 0;

        return new Readable({
            objectMode: true,
            read() {
                if (index < quads.length) {
                    this.push(quads[index]);
                    index++;
                } else {
                    this.push(null);
                }
            }
        });
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

    #write(format: string): Transform {
        return new StreamWriter({format, prefixes: { '': this.#domain.href }});
    }

    async query(request: IncomingMessage): Promise<Writable> {
        const accept = 'TURTLE'
        return this.#data()
            .pipe(this.#describe(request))
            .pipe(this.#write(accept));
    }
}
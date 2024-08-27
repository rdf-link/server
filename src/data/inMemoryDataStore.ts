import type { TransformCallback, Writable } from "node:stream";

import type { BlankNode, Quad } from "@rdfjs/types";

import { Readable, Transform } from "node:stream";

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

    #describe(resource: string): Transform {
        const term = DataFactory.namedNode(resource);
        const that = this;
    
        return new Transform({
            // Make sure chunks are considered as object instead of buffers
            objectMode: true,
    
            transform(quad, encoding, callback) {
                if (quad.subject.equals(term)) {
                    that.#describeObjectBlankNode(quad, this);
                    this.push(quad);
                    callback();
                }
                else if (quad.object.equals(term)) {
                    that.#describeSubjectBlankNode(quad, this);
                    this.push(quad);
                    callback();
                }
                else {
                    callback(null, undefined);
                }
            },
        });
    }

    #describeObjectBlankNode(quad: Quad, transform: Transform) {
        if (quad.object.termType === "BlankNode") {
            for (const blankNodeSubjectQuad of this.#store.getQuads(quad.object, null, null, null)) {
                transform.push(blankNodeSubjectQuad);
                this.#describeObjectBlankNode(blankNodeSubjectQuad, transform);
            }
        }
    }

    #describeSubjectBlankNode(quad: Quad, transform: Transform) {
        if (quad.subject.termType === "BlankNode") {
            for (const blankNodeObjectQuad of this.#store.getQuads(null, null, quad.subject, null)) {
                transform.push(blankNodeObjectQuad);
                this.#describeSubjectBlankNode(blankNodeObjectQuad, transform);
            }
        }
    }

    #write(format: string): Transform {
        return new StreamWriter({format, prefixes: { '': this.#domain.href }});
    }

    async query(resource: string): Promise<Writable> {
        const accept = 'TURTLE'
        return this.#data()
            .pipe(this.#describe(resource))
            .pipe(this.#write(accept));
    }

    iriNodeExists(iri: URL): boolean {
        const term = DataFactory.namedNode(iri.href);

        if (this.#store.getQuads(term, null, null, null).length > 0) {
            return true;
        }

        if (this.#store.getQuads(null, null, term, null).length > 0) {
            return true;
        }

        return false;
    }
}
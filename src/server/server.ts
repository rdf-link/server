import type { Server as NodeServer } from "node:http";

import type { DataStore } from "../data/dataStore.js";

import { createServer } from 'node:http';

import { requestIsIriQuery } from '../request/requestIsIriQuery.js';
import { requestIsLiteralQuery } from '../request/requestIsLiteralQuery.js';
import { requestDoesNotTargetWebDocument } from '../request/requestDoesNotTargetWebDocument.js';
import { requestIsNotHandledByServer } from '../request/requestIsNotHandledByServer.js';
import { requestIsSearchQuery } from '../request/requestIsSearchQuery.js';
import { requestMethodIsNotSupported } from '../request/requestMethodIsNotSupported.js';
import { requestQueryIsUnexpected } from '../request/requestQueryIsUnexpected.js';

export class Server {
    #datastore: DataStore;
    #domain: URL;
    #server: NodeServer

    constructor(datastore: DataStore, domain: URL) {
        this.#datastore = datastore;

        this.#domain = domain;

        this.#server = createServer(async (request, response) => {
            // 1. Handle unsupported HTTP methods
            if (requestMethodIsNotSupported(request.method, response)) {
                return response.end();
            }
        
            // 2. Parse URL
            const url = new URL(`${request.url}`, this.#domain);
        
            // 3. Handle requests that do not target web documents
            if (await requestDoesNotTargetWebDocument(url, this.#datastore, response)) {
                return response.end();
            }
        
            // 4. Handle unexpected query
            if (requestQueryIsUnexpected(url, response)) {
                return response.end()
            }
        
            // 5. Handle IRI query
            if (await requestIsIriQuery(url, this.#datastore, response)) {
                return response.end();
            }
        
            // 6. Handle Literal query
            if (await requestIsLiteralQuery(url, this.#datastore, response)) {
                return response.end();
            }
        
            // 7. Handle search query
            if (await requestIsSearchQuery(url, this.#datastore, response)) {
                return response.end();
            }
        
            // TODO
            // Acceptable representation for resource or 406
            //    - Accept: media types
            //    - Encoding
            //    - Language
            // -> ?iri=<https://example.org/bdsfo>
            // -> ?literal=<example>
            // -> ?search=<example search all literals>
            // -> ?query=<parameterized query>
            // -> ?sparql=<query>
        
            // Default to 500 if request is not handled by server
            requestIsNotHandledByServer(url, response);
            return response.end();
        });
    }

    async start(port: number) {
        return new Promise((resolve) => {
            this.#server.listen(port, () => {
                console.log(`Node environment: ${process.env.NODE_ENV}`);
                console.log(`Server running: http://${process.env.HOST ?? 'localhost'}:${port}/`);
                resolve(null);
            });
        });
    }

    async stop() {
        return new Promise((resolve) => {
            this.#server.close(() => {
                console.log('Server stopped');
                resolve(null);
            });
        });
    }
}

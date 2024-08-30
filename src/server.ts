import { createServer } from 'node:http';
import { Readable } from 'node:stream';

import { config } from './config.js';

import { InMemoryDataStore } from './data/inMemoryDataStore.js';
import { requestIsIriQuery } from './request/requestIsIriQuery.js';
import { requestIsLiteralQuery } from './request/requestIsLiteralQuery.js';
import { requestDoesNotTargetWebDocument } from './request/requestDoesNotTargetWebDocument.js';
import { requestIsNotHandledByServer } from './request/requestIsNotHandledByServer.js';
import { requestIsSearchQuery } from './request/requestIsSearchQuery.js';
import { requestMethodIsNotSupported } from './request/requestMethodIsNotSupported.js';
import { requestQueryIsUnexpected } from './request/requestQueryIsUnexpected.js';


// Instantiate in memory RDF datastore
const datastore = new InMemoryDataStore(Readable.from(config.data), config.dataFormat, config.domain);

const server = createServer(async (request, response) => {
    // 1. Handle unsupported HTTP methods
    if (requestMethodIsNotSupported(request, response)) {
        return response.end();
    }

    // 2. Parse URL
    const url = new URL(`${request.url}`, config.domain);

    // 3. Handle requests that do not target web documents
    if (await requestDoesNotTargetWebDocument(url, datastore, response)) {
        return response.end();
    }

    // 4. Handle unexpected query
    if (requestQueryIsUnexpected(url, response)) {
        return response.end()
    }

    // 5. Handle IRI query
    if (await requestIsIriQuery(url, datastore, response)) {
        return response.end();
    }

    // 6. Handle Literal query
    if (await requestIsLiteralQuery(url, datastore, response)) {
        return response.end();
    }

    // 7. Handle search query
    if (await requestIsSearchQuery(url, datastore, response)) {
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

export async function startServer({ port } = config) {
    return new Promise((resolve) => {
        server.listen(port, () => {
            console.log(`Node environment: ${config.environment}`);
            console.log(`Server running: http://${process.env.HOST ?? 'localhost'}:${port}/`);
            resolve(null);
        });
    });
}

export async function stopServer() {
    return new Promise((resolve) => {
        server.close(() => {
            console.log('Server stopped');
            resolve(null);
        });
    });
}

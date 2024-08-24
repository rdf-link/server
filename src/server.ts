import { createServer } from 'node:http';

import { config } from './config.js';
import { InMemoryDataStore } from './data/inMemoryDataStore.js';
import { Readable } from 'node:stream';
import { requestMethodIsSupported } from './request/requestMethodIsSupported.js';


// Instantiate in memory RDF datastore
const datastore = new InMemoryDataStore(Readable.from(config.data), config.dataFormat, config.domain);

const server = createServer(async (request, response) => {
    // 1. Method implemented on server or 501
    if (!requestMethodIsSupported(request, response)) {
        return response.end();
    }

    // 2. Parse URL
    const url = new URL(`${request.url}`, config.domain);

    // 3. If no query parameters
    if (url.searchParams.size === 0) {
        // 3.1. If resource exists 303
        if (datastore.resourceExists(url)) {
            response.writeHead(303, { 'Location': `/?iri=${url.href}` });
            return response.end();
        }
        // 3.2. Otherwise 404
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        return response.end(`Resource does not exist: ${url.href}`);
    }

    // 4. If no query parameters and resource exists 303
    if (url.searchParams.size === 0 && !datastore.resourceExists(url)) {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        return response.end(`Resource does not exist: ${url.href}`);
    }

    // 3. If parameters anywhere but root 400
    if (url.pathname !== "/" && url.searchParams.size > 0) {
        response.writeHead(400, { 'Content-Type': 'text/plain' });
        return response.end('URL query parameters only available on root');
    }

    // 4. If unknown query parameters 400
    const knownQueryParameters = [ "iri" ];
    const queryParameters = Array.from(url.searchParams.keys());
    if (queryParameters.length > 0) {
        const unknownQueryParameters = queryParameters.filter((param) => !knownQueryParameters.includes(param));
        if (unknownQueryParameters.length > 0) {
            response.writeHead(400, { 'Content-Type': 'text/plain' });
            return response.end(`Unknown URL query parameters: ${unknownQueryParameters}`);
        }
    }

    // 5. If more than one query parameter 400
    if (queryParameters.length > 1) {
        response.writeHead(400, { 'Content-Type': 'text/plain' });
        return response.end(`Too many query parameters, only use one at a time.`);
    }
    
    // 6. Retrieve RDF data for resource
    const resource = new URL(url.searchParams.get('iri') || '');

    // 3. Resource exists or 404

    // 4. Method allowed on resource or 405
    // response.setHeader('Allow', config.supportedRequestMethods.join(', '));

    
    // 5. Acceptable representation for resource exists or 406
    //    - Accept: media types
    //    - Encoding
    //    - Language

    // 6. Resource is a web document or 303
    // -> ?iri=<https://example.org/bdsfo>
    // -> ?literal=<example>
    // -> ?query=<parameterized query>
    // -> ?search=<example search all literals>
    // -> ?sparql=<query>

    // 7. Return acceptable resource representation

    // TODO error handling
    // TODO make it content negotiable
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/turtle');

    // Query datasource and pipe to response
    (await datastore.query(resource))
        .pipe(response)
        .on('error', (error) => {
            console.error('Error processing data:', error);
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.end('Internal Server Error');
        });
});

server.listen(config.port, () => {
    console.log(`Node environment: ${config.environment}`);
    console.log(`Server running: http://${process.env.HOST ?? 'localhost'}:${config.port}/`);
});

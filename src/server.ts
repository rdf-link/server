import { createServer } from 'node:http';

import { config } from './config.js';
import { HTTP } from './constants.js';
import { InMemoryDataStore } from './data/inMemoryDataStore.js';
import { Readable } from 'node:stream';
import { requestMethodIsSupported } from './request/requestMethodIsSupported.js';


// Instantiate the RDF datastore in memory
const datastore = new InMemoryDataStore(Readable.from(config.data), config.dataFormat, new URL(config.domain));


const server = createServer(async (request, response) => {
    // 1. Method implemented on server or 501
    if (!requestMethodIsSupported(request, response)) {
        return response.end();
    }

    // 2. Retrieve RDF data for resource

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
    (await datastore.query(request))
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

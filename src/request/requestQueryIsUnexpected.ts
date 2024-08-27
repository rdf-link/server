import type { ServerResponse, IncomingMessage } from "http";

import { HTTP } from '../constants.js';

export function requestQueryIsUnexpected(url: URL, response: ServerResponse<IncomingMessage> & { req: IncomingMessage; }): boolean {
    // If query parameters anywhere but root 400
    if (url.pathname !== "/") {
        response.writeHead(HTTP.STATUS.CLIENT_ERROR.BAD_REQUEST, { 'Content-Type': 'text/plain' });
        response.write('URL query parameters only available on root');
        return true;
    }

    // If unknown query parameters 400
    const knownQueryParameters = [ "iri" ];
    const queryParameters = Array.from(url.searchParams.keys());
    if (queryParameters.length > 0) {
        const unknownQueryParameters = queryParameters.filter((param) => !knownQueryParameters.includes(param));
        if (unknownQueryParameters.length > 0) {
            response.writeHead(HTTP.STATUS.CLIENT_ERROR.BAD_REQUEST, { 'Content-Type': 'text/plain' });
            response.write(`Unknown URL query parameters: ${unknownQueryParameters}`);
            return true;
        }
    }

    // If more than one query parameter 400
    if (queryParameters.length > 1) {
        response.writeHead(HTTP.STATUS.CLIENT_ERROR.BAD_REQUEST, { 'Content-Type': 'text/plain' });
        response.write(`Too many query parameters, only use one at a time.`);
        return true;
    }

    return false;
}

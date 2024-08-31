import type { ServerResponse, IncomingMessage } from "node:http";

import type { DataStore } from "../data/dataStore.js";

import { HTTP } from '../utils/constants.js';

export async function requestDoesNotTargetWebDocument(url: URL, datastore: DataStore, response: ServerResponse<IncomingMessage> & { req: IncomingMessage; }): Promise<boolean> {
    // All web documents are targeted by requests with a query component.
    if (url.searchParams.size > 0) {
        return false;
    }
    // If request does not target a web document:
    //    - either Location for content negotiated representation is found (303),
    //    - or not (404).
    if (await datastore.iriIsSubjectOrObject(url.href)) {
        response.writeHead(HTTP.STATUS.REDIRECTION.SEE_OTHER, { 'Location': `/?iri=${encodeURIComponent(url.href)}` });
        return true;
    }

    response.writeHead(HTTP.STATUS.CLIENT_ERROR.NOT_FOUND, { 'Content-Type': 'text/plain' });
    response.write(`Resource does not exist: ${url.href}`)
    return true;
}

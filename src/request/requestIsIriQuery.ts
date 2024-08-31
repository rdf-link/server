import type { ServerResponse, IncomingMessage } from "node:http";

import type { DataStore } from "../data/dataStore.js";

import { HTTP } from "../utils/constants.js";
import { writeResponse } from "../utils/writeResponse.js";

export async function requestIsIriQuery(url: URL, datastore: DataStore, response: ServerResponse<IncomingMessage> & { req: IncomingMessage; }): Promise<boolean> {
    if (!url.searchParams.has('iri')) {
        return false;
    }

    response.writeHead(HTTP.STATUS.SUCCESSFUL.OK, { 'Content-Type': 'text/turtle' });

    await writeResponse((await datastore.iri(decodeURIComponent(url.searchParams.get('iri') || ''))), response);
    return true;
}

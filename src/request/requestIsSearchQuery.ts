import type { ServerResponse, IncomingMessage } from "node:http";

import type { DataStore } from "../data/DataStore.js";

import { HTTP } from "../constants.js";
import { writeResponse } from "../utils/writeResponse.js";

export async function requestIsSearchQuery(url: URL, datastore: DataStore, response: ServerResponse<IncomingMessage> & { req: IncomingMessage; }): Promise<boolean> {
    if (!url.searchParams.has('search')) {
        return false;
    }

    response.writeHead(HTTP.STATUS.SUCCESSFUL.OK, { 'Content-Type': 'text/turtle' });

    await writeResponse((await datastore.search(url.searchParams.get('search') || '')), response);
    return true;
}

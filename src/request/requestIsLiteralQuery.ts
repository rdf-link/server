import type { ServerResponse, IncomingMessage } from "node:http";

import type { DataStore } from "../data/DataStore.js";

import { HTTP } from "../constants.js";
import { writeResponse } from "../utils/writeResponse.js";

export async function requestIsLiteralQuery(url: URL, datastore: DataStore, response: ServerResponse<IncomingMessage> & { req: IncomingMessage; }): Promise<boolean> {
    if (!url.searchParams.has('literal')) {
        return false;
    }

    response.writeHead(HTTP.STATUS.SUCCESSFUL.OK, { 'Content-Type': 'text/turtle' });

    await writeResponse((await datastore.literal(url.searchParams.get('literal') || '')), response);
    return true;
}

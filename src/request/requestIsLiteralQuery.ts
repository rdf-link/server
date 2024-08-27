import type { ServerResponse, IncomingMessage } from "http";

import type { InMemoryDataStore } from "../data/inMemoryDataStore.js";

import { HTTP } from "../constants.js";
import { writeResponse } from "../utils/writeResponse.js";

export async function requestIsLiteralQuery(url: URL, datastore: InMemoryDataStore, response: ServerResponse<IncomingMessage> & { req: IncomingMessage; }): Promise<boolean> {
    if (!url.searchParams.has('literal')) {
        return false;
    }

    response.writeHead(HTTP.STATUS.SUCCESSFUL.OK, { 'Content-Type': 'text/turtle' });

    await writeResponse((await datastore.literalQuery(url.searchParams.get('literal') || '')), response);
    return true;
}

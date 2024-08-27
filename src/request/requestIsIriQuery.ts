import type { ServerResponse, IncomingMessage } from "http";
import type { Writable } from "node:stream";

import type { InMemoryDataStore } from "../data/inMemoryDataStore";

import { HTTP } from '../constants.js';

export async function requestIsIriQuery(url: URL, datastore: InMemoryDataStore, response: ServerResponse<IncomingMessage> & { req: IncomingMessage; }): Promise<boolean> {
    if (!url.searchParams.has('iri')) {
        return false;
    }

    response.writeHead(HTTP.STATUS.SUCCESSFUL.OK, { 'Content-Type': 'text/turtle' });

    await writeResponse((await datastore.query(decodeURIComponent(url.searchParams.get('iri') || ''))), response);
    return true;
}

const writeResponse = (writable: Writable, response: ServerResponse<IncomingMessage> & { req: IncomingMessage; }) => {
    return  new Promise((resolve, reject) => {
      writable.pipe(response);
      response.on("end", () => {
        resolve(true);
      });
      response.on("error", (error) => {
        console.error('Error processing data:', error);
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.end('Internal Server Error');
        resolve(false);
      });
    });
  };

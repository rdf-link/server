import type { IncomingMessage, ServerResponse } from 'node:http';

import { HTTP } from '../constants.js';

export function requestIsNotHandledByServer(url: URL, response: ServerResponse<IncomingMessage> & { req: IncomingMessage; }) {
    response.writeHead(HTTP.STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR, { 'Content-Type': 'text/plain' });
    response.write(`Internal Server Error: request to ${url.href} is not handled by the server`);
}

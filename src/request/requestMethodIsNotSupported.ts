import type { IncomingMessage, ServerResponse } from 'node:http';

import { HTTP } from '../constants.js';

export function requestMethodIsNotSupported(request: IncomingMessage, response: ServerResponse<IncomingMessage> & { req: IncomingMessage; }): boolean {
    if (request.method === HTTP.REQUEST_METHOD.GET) {
        return false;
    }
    if (request.method === HTTP.REQUEST_METHOD.HEAD) {
        return false;
    }

    response.writeHead(HTTP.STATUS.SERVER_ERROR.NOT_IMPLEMENTED);
    return true;
}

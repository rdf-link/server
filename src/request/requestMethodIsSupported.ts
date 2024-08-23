import type { IncomingMessage, ServerResponse } from 'node:http';

import { HTTP } from '../constants.js';

export function requestMethodIsSupported(request: IncomingMessage, response: ServerResponse<IncomingMessage> & { req: IncomingMessage; }): boolean {
    if (request.method !== HTTP.REQUEST_METHOD.GET &&
        request.method !== HTTP.REQUEST_METHOD.HEAD &&
        request.method !== HTTP.REQUEST_METHOD.OPTIONS) {
        response.writeHead(HTTP.STATUS.SERVER_ERROR.NOT_IMPLEMENTED);
        return false;
    }
    return true;
}

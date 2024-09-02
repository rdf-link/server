import type { IncomingMessage, ServerResponse } from 'node:http';

import { HTTP } from '../utils/constants.js';

export function requestMethodIsNotSupported(method: string | undefined, response: ServerResponse<IncomingMessage> & { req: IncomingMessage; }): boolean {
    if (method === HTTP.REQUEST_METHOD.GET) {
        return false;
    }
    if (method === HTTP.REQUEST_METHOD.HEAD) {
        return false;
    }

    response.writeHead(HTTP.STATUS.SERVER_ERROR.NOT_IMPLEMENTED);
    return true;
}

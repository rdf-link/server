import type { IncomingMessage, ServerResponse } from "node:http";
import type { Writable } from "node:stream";

export async function writeResponse(writable: Writable, response: ServerResponse<IncomingMessage> & { req: IncomingMessage; }) {
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
  }
  
import { StreamWriter } from "n3";
import { DOMAIN } from "./config";

// Create a stream writer that writes Turtle
// TODO the stream writer is retrieved depending on the content type requested (accept header)
// First accept text/turtle and text/html
export function writer() {
    return new StreamWriter({
        format: 'TURTLE',
        prefixes: { '': DOMAIN }
    });
}
import type { Term } from "@rdfjs/types";
import { Transform } from "node:stream";

// export async function* describe(store: Promise<Iterable<Quad>>, term: Term) {
//     const blanks = [];
//     for (const quad of await store) {
//         if (quad.subject.equals(term)) {
//             yield quad
//         }
//         if (quad.object.equals(term)) {
//             yield quad
//         }
//         // TODO check for blanknodes
//         // keep an array of subjects to check if the blank existed in what's been gone through
//     }
// }

export function describe(term: Term) {
    return new Transform({
        // Make sure chunks are considered as object instead of buffers
        objectMode: true,

        transform(quad, encoding, callback) {
            if (quad.subject.equals(term)) {
                callback(null, quad);
            }
            else if (quad.object.equals(term)) {
                callback(null, quad);
            }
            else {
                callback(null, undefined);
            }
        },
    });
}

import type { Quad, Term } from "@rdfjs/types";

export async function* describe(store: Promise<Iterable<Quad>>, term: Term) {
    const blanks = [];
    for (const quad of  await store) {
        if (quad.subject.equals(term)) {
            yield quad
        }
        if (quad.object.equals(term)) {
            yield quad
        }
        // TODO check for blanknodes
        // keep an array of subjects to check if the blank existed in what's been gone through
    }
}

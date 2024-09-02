import type { Writable } from "node:stream";

export abstract class DataStore {
    // TODO something like describe where ?x a property
    // abstract describe=s|p|o s?= p?= o?= (also gives label...)

    abstract iriIsSubjectOrObject(resource: string): Promise<boolean>;
    
    abstract iri(resource: string): Promise<Writable>;

    // TODO parse literal for lang and type
    abstract literal(resource: string): Promise<Writable>;

    // TODO add lang and type to literal search
    abstract search(pattern: string): Promise<Writable>;
}

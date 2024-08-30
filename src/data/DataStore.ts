import type { Writable } from "node:stream";

export abstract class DataStore {
    abstract iriIsSubjectOrObject(resource: string): Promise<boolean>;

    abstract iri(resource: string): Promise<Writable>;

    abstract literal(resource: string): Promise<Writable>;

    abstract search(resource: string): Promise<Writable>;
}

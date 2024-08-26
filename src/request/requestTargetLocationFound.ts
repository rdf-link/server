import type { InMemoryDataStore } from '../data/inMemoryDataStore.js';

export function requestTargetLocationFound(url: URL, datastore: InMemoryDataStore): boolean {
    // If there is data for the resource, its location is found
    return datastore.iriNodeExists(url);
}

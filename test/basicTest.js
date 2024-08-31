import assert from "node:assert";
import { after, before, describe, it } from "node:test";

import { Readable } from 'node:stream';

import { InMemoryDataStore } from '../dist/data/inMemoryDataStore.js';
import { config } from '../dist/config.js';
import { Server } from "../dist/server/server.js"

const PORT = 7070;
const datastore = new InMemoryDataStore(Readable.from(config.data), config.dataFormat, config.domain);
const server = new Server(datastore, config.domain);

describe('Simple Get ', async () => {
    before(async () => { await server.start(PORT); });
    after(async () => {  await server.stop(); });

    await it('should work', async () => {
        const response = await fetch(new URL(`http://localhost:${PORT}/`));

        assert.strictEqual(response.status, 200);
        assert.strictEqual(await response.text(), "@prefix : <https://example.org/>.\n\n<https://example.org/> <x> <y>.\n")
    });

    it('should be ok', () => {
        assert.strictEqual(2, 2);
    });

    describe('a nested thing', () => {
        it('should work', () => {
            assert.strictEqual(3, 3);
        });
    });
}); 

import assert from "node:assert";
import { after, before, describe, it } from "node:test";

import { startServer, stopServer } from "../dist/server.js"

const PORT = 7070;

describe('Simple Get ', async () => {
    before(async () => { await startServer(PORT); });
    after(async () => {  await stopServer(); });

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

import { Readable } from 'node:stream';

import { InMemoryDataStore } from './data/inMemoryDataStore.js';
import { config } from './server/config.js';
import { Server } from "./server/server.js"

const datastore = new InMemoryDataStore(Readable.from(config.data), config.dataFormat, config.domain);

const server = new Server(datastore, config.domain);

server.start(3000);

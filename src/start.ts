import { Readable } from 'node:stream';

import { config } from './config.js';

import { InMemoryDataStore } from './data/inMemoryDataStore.js';
import { Server } from "./server/server.js"

const datastore = new InMemoryDataStore(Readable.from(config.data), config.dataFormat, config.domain);

const server = new Server(datastore);

server.start();

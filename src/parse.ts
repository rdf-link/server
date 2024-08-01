import { Quad, StreamParser } from "n3";

import { DOMAIN } from './config.js';

export function parse(): StreamParser<Quad> {
    return new StreamParser({ baseIRI: DOMAIN, format: 'Turtle' });
}
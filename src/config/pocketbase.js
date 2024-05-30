import "dotenv/config";

import PocketBase from "pocketbase";
import EventSource from "eventsource";

const POCKETBASE_SOURCE = process.env["POCKETBASE_SOURCE"];
const POCKETBASE_TARGET = process.env["POCKETBASE_TARGET"];

global.EventSource = EventSource;
export const pbSource = new PocketBase(POCKETBASE_SOURCE);
export const pbTarget = new PocketBase(POCKETBASE_TARGET);

import { db_path } from "./config.ts";
import * as ops from "./operations.ts";
import { format } from "@std/datetime";
const kv = await Deno.openKv(db_path);
ops.init();
console.log(`KV opened at: ${db_path}`);
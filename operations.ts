import { db_path, counter_key } from "./config.ts";
import { format } from "@std/datetime";
let kv: Deno.Kv;
let alive = true;

export const init = async () => {
    if (kv) {
        console.warn("init: already called");
        return;
    }
    kv = await Deno.openKv(db_path);
	console.log("Started");
}

export const cleanup = () => {
    if (!alive) {
        return;
    }
    if (kv) {
        (async () => { 
            try {
                await kv.close();
            } catch (error) {
                if (!(error instanceof Deno.errors.BadResource)) {
                    // console.log("DB already closed");
                    console.error(error);
                }
            }
        })();
    } else {
        console.warn("cleanup: database was not initialized");
    }
    console.log("Ended");
    alive = false;
    Deno.exit();
}

export const get_counter = async () => {
    const entry = await kv.get([counter_key]);
    if (entry.value == null) {
        console.log("No counter, init to 0");
        kv.set([counter_key], 0);
        return 0;
    } else {
        return entry.value as number;
    }
}

export const increment_counter = async () => {
    const currcount = await get_counter();
    const nextcount = currcount + 1;
    console.log(`[${format(new Date(), "MM-dd-yyyy HH:mm:ss")}]: ${currcount}`);
    kv.set([counter_key], nextcount);
    return nextcount
}

export const reset = async () => {
    await kv.delete([counter_key]);
}
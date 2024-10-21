import { increment_counter, init, cleanup } from "./operations.ts";

const start_bot = () => {
    init();

	Deno.cron(
		"Count once a minute",
		"* * * * *",
		{
			backoffSchedule: [1000, 5000, 10000],
		},
		() => {
			increment_counter();
		}
	);
};

globalThis.onload = start_bot;
globalThis.onunload = cleanup;
Deno.addSignalListener("SIGINT", cleanup);
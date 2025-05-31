import { ClockSettings } from "src/Clock";
import { CountdownSettings } from "src/Countdown";
import { CounterSettings } from "src/Counter";
import { QuoteSettings } from "src/Quote";
import { StopwatchSettings } from "src/Stopwatch";

export type WidgetType = "quote" | "clock" | "countdown" | "counter" | "stopwatch";

export type WidgetSettings =
	| ClockSettings
	| QuoteSettings
	| CountdownSettings
	| CounterSettings
	| StopwatchSettings;

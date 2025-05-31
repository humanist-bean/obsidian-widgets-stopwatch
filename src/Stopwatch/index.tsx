import React, { useEffect, useState } from "react";
import { moment } from "obsidian";
import { WidgetType } from "src/types/Widgets";
import { Moment } from "moment";

const Stopwatch = ({
	settings: { date, to, completedLabel, show },
}: StopwatchProps) => {
	const [stopwatch, setStopwatch] = useState<StopwatchState>({
		hours: 0,
		minutes: 0,
		seconds: 0,
	});
	const [dateMessage, setDateMessage] = useState<string | null>(null);

	const showItems = show?.split(",").map((item) => item.trim()) || [];
	const showState: StopwatchShowState = {
		hours: show ? showItems.includes("hours") : true,
		minutes: show ? showItems.includes("minutes") : true,
		seconds: show ? showItems.includes("seconds") : true,
	};

	useEffect(() => {
		// Check if date is in the format +[number][s/m/h/d/y]
		const startTime = moment();


		if (!startTime.isValid()) {
			setDateMessage("Invalid Date");
			return;
		}

		const clockInterval = setInterval(() => {
			const currentTime = moment();
			const diffInSeconds = Math.abs(startTime.diff(currentTime, "seconds"));
			console.log(`TEST: diffInSeconds ${diffInSeconds}`);

			const hours = Math.floor((diffInSeconds % 86400) / 3600);
			const minutes = Math.floor((diffInSeconds % 3600) / 60);
			const seconds = Math.floor(diffInSeconds % 60);

			setStopwatch({ hours, minutes, seconds });
		}, 1000);

		return () => {
			clearInterval(clockInterval);
		};
	}, [date]);

	return (
		<>
			<div className="Stopwatch_Container">
				{showState.hours && (
					<div className="Stopwatch_Item">
						<h3>{stopwatch.hours}</h3>
						<small>hours</small>
					</div>
				)}
				{showState.minutes && (
					<div className="Stopwatch_Item">
						<h3>{stopwatch.minutes}</h3>
						<small>minutes</small>
					</div>
				)}
				{showState.seconds && (
					<div className="Stopwatch_Item">
						<h3>{stopwatch.seconds}</h3>
						<small>seconds</small>
					</div>
				)}
			</div>
			<div className="Stopwatch_To">{to}</div>
		</>
	);
};

export default Stopwatch;

export interface StopwatchSettings {
	type: WidgetType;
	date: string;
	to: string;
	completedLabel: string;
	show?: string;
}

interface StopwatchProps {
	settings: StopwatchSettings;
}

interface StopwatchState {
	hours: number;
	minutes: number;
	seconds: number;
}

interface StopwatchShowState {
	hours: boolean;
	minutes: boolean;
	seconds: boolean;
}

import React, { useEffect, useState } from "react";
import { moment } from "obsidian";
import { WidgetType } from "src/types/Widgets";
import { Moment } from "moment";

const Stopwatch = ({
	settings: { date, to, completedLabel, show },
}: StopwatchProps) => {
	const [countdown, setStopwatch] = useState<StopwatchState>({
		years: 0,
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});
	const [invalidDate, setInvalidDate] = useState<string | null>(null);

	const showItems = show?.split(",").map((item) => item.trim()) || [];
	const showState: StopwatchShowState = {
		years: show ? showItems.includes("years") : true,
		days: show ? showItems.includes("days") : true,
		hours: show ? showItems.includes("hours") : true,
		minutes: show ? showItems.includes("minutes") : true,
		seconds: show ? showItems.includes("seconds") : true,
	};

	useEffect(() => {
		// Check if date is in the format +[number][s/m/h/d/y]
		const dateRegex = /^(\+)(\d+)([smhdy])$/;
		const dateMatch = date.match(dateRegex);
		let endTime: Moment;

		if (dateMatch) {
			const [, , value, unit] = dateMatch;

			const currentTime = moment();
			endTime = currentTime.clone();

			switch (unit) {
				case "s":
					endTime.add(parseInt(value), "seconds");
					break;
				case "m":
					endTime.add(parseInt(value), "minutes");
					break;
				case "h":
					endTime.add(parseInt(value), "hours");
					break;
				case "d":
					endTime.add(parseInt(value), "days");
					break;
				case "y":
					endTime.add(parseInt(value), "years");
					break;
			}
		} else {
			endTime = moment(`${date}`);
		}

		if (!endTime.isValid()) {
			setInvalidDate("Invalid Date");
			return;
		}

		const clockInterval = setInterval(() => {
			const currentTime = moment();
			const diffInSeconds = endTime.diff(currentTime, "seconds");

			if (diffInSeconds < 0) {
				setInvalidDate(completedLabel || "Completed! 🎉");
				return;
			}

			const years = Math.floor(diffInSeconds / 31536000);
			const days = Math.floor((diffInSeconds % 31536000) / 86400);
			const hours = Math.floor((diffInSeconds % 86400) / 3600);
			const minutes = Math.floor((diffInSeconds % 3600) / 60);
			const seconds = Math.floor(diffInSeconds % 60);

			setStopwatch({ years, days, hours, minutes, seconds });
		}, 1000);

		return () => {
			clearInterval(clockInterval);
		};
	}, [date]);

	if (invalidDate) {
		return (
			<>
				<div className="Stopwatch_Container">
					<div className="Stopwatch_Item">
						<h3>{invalidDate}</h3>
					</div>
				</div>
				<div className="Stopwatch_To">{to}</div>
			</>
		);
	}

	return (
		<>
			<div className="Stopwatch_Container">
				{showState.years && (
					<div className="Stopwatch_Item">
						<h3>{countdown.years}</h3>
						<small>years</small>
					</div>
				)}
				{showState.days && (
					<div className="Stopwatch_Item">
						<h3>{countdown.days}</h3>
						<small>days</small>
					</div>
				)}
				{showState.hours && (
					<div className="Stopwatch_Item">
						<h3>{countdown.hours}</h3>
						<small>hours</small>
					</div>
				)}
				{showState.minutes && (
					<div className="Stopwatch_Item">
						<h3>{countdown.minutes}</h3>
						<small>minutes</small>
					</div>
				)}
				{showState.seconds && (
					<div className="Stopwatch_Item">
						<h3>{countdown.seconds}</h3>
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
	years: number;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
}

interface StopwatchShowState {
	years: boolean;
	days: boolean;
	hours: boolean;
	minutes: boolean;
	seconds: boolean;
}

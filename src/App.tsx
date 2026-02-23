import { DistrictMap } from "./components/DistrictMap";
import { InfoPanel } from "./components/InfoPanel";
import { Legend } from "./components/Legend";
import { useClosings } from "./hooks/useClosings";

export const App = () => {
	const {
		dateOptions,
		selectedDate,
		setSelectedDate,
		getDistrictStatus,
		lastUpdated,
	} = useClosings();

	return (
		<>
			<DistrictMap
				getDistrictStatus={getDistrictStatus}
				lastUpdated={lastUpdated}
			/>
			<div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-1050 flex flex-col gap-4">
				<InfoPanel
					dateOptions={dateOptions}
					selectedDate={selectedDate}
					onDateChange={setSelectedDate}
					lastUpdated={lastUpdated}
				/>
				<Legend />
			</div>
			<div className="fixed top-4 left-4 z-1050 flex flex-col gap-1">
				<div className="flex gap-4">
					<a
						href="https://edlrod.com"
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-600 dark:text-blue-400 hover:underline"
					>
						edlrod.com
					</a>
					<a
						href="https://github.com/edlrod/snowday-map"
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-600 dark:text-blue-400 hover:underline"
					>
						GitHub
					</a>
				</div>
				<span className="text-zinc-500 dark:text-zinc-400">
					powered by{" "}
					<a
						href="https://longisland.news12.com"
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-600 dark:text-blue-400 hover:underline"
					>
						News12
					</a>
				</span>
				<span className="text-xs text-zinc-500 dark:text-zinc-400"></span>
			</div>
		</>
	);
};

import { DistrictMap } from "./components/DistrictMap";
import { InfoPanel } from "./components/InfoPanel";
import { Legend } from "./components/Legend";
import { useClosings } from "./hooks/useClosings";

export const App = () => {
	const { dateOptions, selectedDate, setSelectedDate, getDistrictStatus } =
		useClosings();

	return (
		<>
			<DistrictMap getDistrictStatus={getDistrictStatus} />
			<div className="fixed bottom-4 right-4 z-40 flex flex-col gap-4">
				<InfoPanel
					dateOptions={dateOptions}
					selectedDate={selectedDate}
					onDateChange={setSelectedDate}
				/>
				<Legend />
			</div>
		</>
	);
};

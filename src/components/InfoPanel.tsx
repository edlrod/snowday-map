import { Card } from "./Card";

interface DateOption {
	value: string;
	label: string;
}

interface InfoPanelProps {
	dateOptions: DateOption[];
	selectedDate: string;
	onDateChange: (value: string) => void;
	lastUpdated: Date | null;
}

export const InfoPanel = ({
	dateOptions,
	selectedDate,
	onDateChange,
	lastUpdated,
}: InfoPanelProps) => {
	return (
		<Card className="flex flex-col">
			<span className="font-bold">
				Live snow day updates for Long Island, NY
			</span>
			{lastUpdated && (
				<span className="text-sm text-zinc-500 dark:text-zinc-400">
					Updated {lastUpdated.toLocaleTimeString()}
				</span>
			)}
			<select
				value={selectedDate}
				onChange={(e) => onDateChange(e.target.value)}
				className="border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-black dark:text-white px-2 py-1 mt-4"
			>
				{dateOptions.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</Card>
	);
};

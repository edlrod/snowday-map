import { Card } from "./Card";

interface DateOption {
	value: string;
	label: string;
}

interface InfoPanelProps {
	dateOptions: DateOption[];
	selectedDate: string;
	onDateChange: (value: string) => void;
}

export const InfoPanel = ({
	dateOptions,
	selectedDate,
	onDateChange,
}: InfoPanelProps) => {
	return (
		<Card>
			<p className="text-center font-bold">
				Live snow day updates for Long Island, NY
			</p>
			<div className="flex items-center justify-between gap-4 mt-4">
				<select
					value={selectedDate}
					onChange={(e) => onDateChange(e.target.value)}
					className="border border-gray-300 px-2 py-1"
				>
					{dateOptions.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				<a
					href="https://edlrod.com"
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-600 hover:underline"
				>
					edlrod.com
				</a>
			</div>
		</Card>
	);
};

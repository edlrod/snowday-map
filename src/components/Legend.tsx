import { Card } from "./Card";

const legendItems = [
	{ color: "#ef4444", label: "Closed" },
	{ color: "#7f1d1d", label: "Remote Learning" },
	{ color: "#eab308", label: "Delay" },
	{ color: "#ffffff", label: "Open / Unknown" },
];

export const Legend = () => (
	<Card>
		<p className="font-semibold mb-2">Legend</p>
		<div className="flex flex-col gap-2">
			{legendItems.map((item) => (
				<div key={item.label} className="flex items-center gap-2">
					<div
						className="w-5 h-5 border border-black dark:border-white"
						style={{ backgroundColor: item.color }}
					/>
					<span className="text-sm">{item.label}</span>
				</div>
			))}
		</div>
	</Card>
);

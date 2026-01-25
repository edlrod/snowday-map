import type { DistrictStatus } from "../types";

interface TooltipProps {
	visible: boolean;
	x: number;
	y: number;
	districtName: string;
	status: DistrictStatus;
}

const getStatusLabel = (status: DistrictStatus): string => {
	switch (status) {
		case "closed":
			return "Closed";
		case "remote":
			return "Remote Learning";
		case "delay":
			return "Delay";
		default:
			return "Unknown / Open";
	}
};

const toTitleCase = (str: string): string =>
	str.replace(
		/\w\S*/g,
		(txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase(),
	);

export const Tooltip = ({
	visible,
	x,
	y,
	districtName,
	status,
}: TooltipProps) => {
	if (!visible) return null;

	return (
		<div
			className="fixed bg-white border border-black p-2 pointer-events-none z-50 whitespace-pre-line"
			style={{
				left: x,
				top: y,
			}}
		>
			{toTitleCase(districtName.replace(/-/g, " "))}
			{"\n"}
			{getStatusLabel(status)}
		</div>
	);
};

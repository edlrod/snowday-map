/** biome-ignore-all lint/a11y/noStaticElementInteractions: needs to be interactable */
import { useCallback, useState } from "react";
import { useDistricts } from "../hooks/useDistricts";
import { usePanning } from "../hooks/usePanning";
import type { DistrictStatus } from "../types";
import { Tooltip } from "./Tooltip";

const SVG_WIDTH = 1450;
const SVG_HEIGHT = 800;

const getStatusColor = (status: DistrictStatus): string =>
	({
		closed: "#ef4444",
		remote: "#7f1d1d",
		delay: "#eab308",
		open: "#ffffff",
	})[status] || "#ffffff";

interface DistrictMapProps {
	getDistrictStatus: (name: string) => DistrictStatus;
}

export const DistrictMap = ({ getDistrictStatus }: DistrictMapProps) => {
	const { districts, loading: districtsLoading } = useDistricts();
	const {
		position,
		scale,
		containerRef,
		handlers: panHandlers,
	} = usePanning(SVG_WIDTH, SVG_HEIGHT);

	const [tooltipData, setTooltipData] = useState<{
		visible: boolean;
		x: number;
		y: number;
		name: string;
		status: DistrictStatus;
	}>({
		visible: false,
		x: 0,
		y: 0,
		name: "",
		status: "open",
	});

	const handleMouseMove = useCallback(
		(e: React.MouseEvent) => {
			panHandlers.onMouseMove(e);
			setTooltipData((prev) => ({
				...prev,
				x: e.clientX,
				y: e.clientY,
			}));
		},
		[panHandlers],
	);

	const handleDistrictEnter = useCallback(
		(name: string) => {
			const status = getDistrictStatus(name);
			setTooltipData((prev) => ({
				...prev,
				visible: true,
				name,
				status,
			}));
		},
		[getDistrictStatus],
	);

	const handleDistrictLeave = useCallback(() => {
		setTooltipData((prev) => ({
			...prev,
			visible: false,
		}));
	}, []);

	if (districtsLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				Loading districts...
			</div>
		);
	}

	return (
		<div
			ref={containerRef}
			className="overflow-hidden h-screen w-screen"
			onMouseDown={panHandlers.onMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={panHandlers.onMouseUp}
			onMouseLeave={panHandlers.onMouseLeave}
		>
			<svg
				width={SVG_WIDTH}
				height={SVG_HEIGHT}
				className="absolute cursor-grab active:cursor-grabbing origin-top-left"
				style={{
					left: position.x,
					top: position.y,
					transform: `scale(${scale})`,
				}}
			>
				<title>Long Island School Districts Map</title>
				{districts.map((district) => {
					const status = getDistrictStatus(district.name);
					return (
						<polygon
							key={district.name}
							points={district.points.join(" ")}
							fill={getStatusColor(status)}
							stroke="black"
							strokeWidth={3}
							onMouseEnter={() => handleDistrictEnter(district.name)}
							onMouseLeave={handleDistrictLeave}
							className="transition-colors duration-200"
						/>
					);
				})}
			</svg>

			<Tooltip
				visible={tooltipData.visible}
				x={tooltipData.x}
				y={tooltipData.y}
				districtName={tooltipData.name}
				status={tooltipData.status}
			/>
		</div>
	);
};

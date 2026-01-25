import type { Feature } from "geojson";
import type { Layer } from "leaflet";
import {
	AttributionControl,
	GeoJSON,
	MapContainer,
	TileLayer,
} from "react-leaflet";
import { useDistricts } from "../hooks/useDistricts";
import type { DistrictProperties, DistrictStatus } from "../types";
import "leaflet/dist/leaflet.css";

const LONG_ISLAND_CENTER: [number, number] = [40.8, -73.2];
const DEFAULT_ZOOM = 10;

const getStatusColor = (status: DistrictStatus): string =>
	({
		closed: "#ef4444",
		remote: "#7f1d1d",
		delay: "#eab308",
		open: "#ffffff",
	})[status] || "#ffffff";

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

interface DistrictMapProps {
	getDistrictStatus: (name: string) => DistrictStatus;
	lastUpdated: Date | null;
}

export const DistrictMap = ({
	getDistrictStatus,
	lastUpdated,
}: DistrictMapProps) => {
	const { districts, loading: districtsLoading } = useDistricts();

	if (districtsLoading || !districts) {
		return (
			<div className="flex items-center justify-center h-screen">
				Loading districts...
			</div>
		);
	}

	const styleFeature = (feature: Feature | undefined) => {
		const props = feature?.properties as DistrictProperties | undefined;
		if (!props?.POPULAR_NA) {
			return {
				fillColor: "#ffffff",
				weight: 1,
				color: "#000",
				fillOpacity: 0.7,
			};
		}
		const status = getDistrictStatus(props.POPULAR_NA);
		return {
			fillColor: getStatusColor(status),
			weight: 1,
			color: "#000",
			fillOpacity: 0.7,
		};
	};

	const onEachFeature = (feature: Feature, layer: Layer) => {
		const props = feature.properties as DistrictProperties | null;
		if (!props?.POPULAR_NA) return;

		const name = props.POPULAR_NA;

		layer.bindTooltip(
			() => {
				const status = getDistrictStatus(name);
				return `<strong>${name}</strong><br/>${getStatusLabel(status)}`;
			},
			{ sticky: true },
		);
	};

	return (
		<MapContainer
			center={LONG_ISLAND_CENTER}
			zoom={DEFAULT_ZOOM}
			className="h-screen w-screen"
			zoomControl={false}
			attributionControl={false}
		>
			<AttributionControl position="topright" prefix={false} />
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
				url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
			/>
			<GeoJSON
				key={lastUpdated?.getTime() ?? 0}
				data={districts}
				style={styleFeature}
				onEachFeature={onEachFeature}
			/>
			<TileLayer
				url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
				pane="shadowPane"
			/>
		</MapContainer>
	);
};

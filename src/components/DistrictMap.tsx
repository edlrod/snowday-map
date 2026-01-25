import type { Feature } from "geojson";
import type { Layer } from "leaflet";
import L from "leaflet";
import { useEffect } from "react";
import {
	AttributionControl,
	GeoJSON,
	MapContainer,
	TileLayer,
	useMap,
} from "react-leaflet";
import { useDarkMode } from "../hooks/useDarkMode";
import { useDistricts } from "../hooks/useDistricts";
import type {
	DistrictProperties,
	DistrictStatus,
	DistrictsGeoJSON,
} from "../types";
import "leaflet/dist/leaflet.css";

const INITIAL_CENTER: [number, number] = [40.8, -73.2];
const INITIAL_ZOOM = 10;

const FitBounds = ({ districts }: { districts: DistrictsGeoJSON }) => {
	const map = useMap();

	useEffect(() => {
		const bounds = L.geoJSON(districts).getBounds();
		map.fitBounds(bounds, { padding: [8, 8] });
	}, [map, districts]);

	return null;
};

const getStatusColor = (status: DistrictStatus, isDark: boolean): string =>
	({
		closed: "#ef4444",
		remote: "#7f1d1d",
		delay: "#eab308",
		open: isDark ? "#27272a" : "#ffffff",
	})[status] || (isDark ? "#27272a" : "#ffffff");

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
	const isDark = useDarkMode();

	const baseUrl = isDark
		? "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
		: "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png";

	const labelsUrl = isDark
		? "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
		: "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png";

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
				fillColor: isDark ? "#27272a" : "#ffffff",
				weight: 1,
				color: isDark ? "#52525b" : "#000",
				fillOpacity: 0.7,
			};
		}
		const status = getDistrictStatus(props.POPULAR_NA);
		return {
			fillColor: getStatusColor(status, isDark),
			weight: 1,
			color: isDark ? "#52525b" : "#000",
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
			center={INITIAL_CENTER}
			zoom={INITIAL_ZOOM}
			className="h-screen w-screen"
			zoomControl={false}
			attributionControl={false}
		>
			<FitBounds districts={districts} />
			<AttributionControl position="topright" prefix={false} />
			<TileLayer
				key={`base-${isDark}`}
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
				url={baseUrl}
			/>
			<GeoJSON
				key={`${lastUpdated?.getTime() ?? 0}-${isDark}`}
				data={districts}
				style={styleFeature}
				onEachFeature={onEachFeature}
			/>
			<TileLayer key={`labels-${isDark}`} url={labelsUrl} pane="shadowPane" />
		</MapContainer>
	);
};

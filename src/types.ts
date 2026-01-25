import type { FeatureCollection, MultiPolygon, Polygon } from "geojson";

export interface DistrictProperties {
	POPULAR_NA: string;
	[key: string]: unknown;
}

export type DistrictsGeoJSON = FeatureCollection<
	Polygon | MultiPolygon,
	DistrictProperties
>;

export type DistrictStatus = "closed" | "remote" | "delay" | "open";

export interface ClosingData {
	name: string;
	status: DistrictStatus;
}

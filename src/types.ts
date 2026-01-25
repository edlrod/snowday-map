export interface District {
	name: string;
	points: string[];
}

export type DistrictStatus = "closed" | "remote" | "delay" | "open";

export interface ClosingData {
	name: string;
	status: DistrictStatus;
}

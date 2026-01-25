import { useCallback, useEffect, useRef, useState } from "react";
import type { DistrictStatus } from "../types";

const NEWS12_SRC =
	"https://itv.news12.com/school_closings/closings.jsp?region=LI";

const simplify = (str: string) => str.replace(/\s|\/|-/g, "").toLowerCase();

// Normalize names by removing common suffixes and punctuation
const normalize = (name: string): string => {
	return name
		.toLowerCase()
		.replace(
			/\b(union free school district|central school district|school district|public schools|ufsd|csd|comn sd|city sd|sd)\b/gi,
			"",
		)
		.replace(/[^a-z0-9]/g, "");
};

// Manual overrides for tricky mappings (News12 normalized -> GeoJSON normalized)
const MANUAL_OVERRIDES: Record<string, string> = {
	comsewogue: "brookhavencomsewogue",
	plainedge: "plainedge",
	springs: "springs",
	mountsinai: "mtsinai",
};

const parseStatus = (statusText: string): DistrictStatus => {
	const simplified = simplify(statusText);
	if (simplified.includes("closed")) return "closed";
	if (statusText.trim() === "All Day, Evening Classes and Activities Canceled")
		return "closed";
	if (simplified.includes("remote")) return "remote";
	if (simplified.includes("delay")) return "delay";
	return "open";
};

interface DateOption {
	value: string;
	label: string;
}

export const useClosings = () => {
	const [closings, setClosings] = useState<Map<string, DistrictStatus>>(
		new Map(),
	);
	const [dateOptions, setDateOptions] = useState<DateOption[]>([]);
	const [selectedDate, setSelectedDate] = useState("1");
	const [loading, setLoading] = useState(true);
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

	const fetchClosings = useCallback(
		async (refreshDropdown: boolean) => {
			try {
				const response = await fetch(NEWS12_SRC);
				const html = await response.text();

				const parser = new DOMParser();
				const doc = parser.parseFromString(html, "text/html");

				if (refreshDropdown) {
					const headers = doc.querySelectorAll("#table_header div");
					const options: DateOption[] = Array.from(headers).map((el, i) => ({
						value: String(i),
						label: el.textContent || `Option ${i}`,
					}));
					setDateOptions(options);

					const tomorrowIdx = options.findIndex((opt) =>
						opt.label.toLowerCase().includes("tomorrow"),
					);
					if (tomorrowIdx >= 0) {
						setSelectedDate(String(tomorrowIdx));
					}
				}

				const tables = doc.querySelectorAll("table");
				const dataTable = tables[1];
				if (!dataTable) {
					setLoading(false);
					return;
				}

				const tbody = dataTable.querySelector("tbody");
				if (!tbody) {
					setLoading(false);
					return;
				}

				const rows = Array.from(tbody.children).filter(
					(row) => row.getAttribute("df") === selectedDate,
				);

				const newClosings = new Map<string, DistrictStatus>();

				for (const row of rows) {
					const cells = row.children;
					if (cells.length < 3) continue;

					const name = cells[0].textContent || "";
					const statusText = cells[2].textContent || "";

					const simplifiedName = simplify(name);
					if (
						/ufsd|schooldistrict|publicschool|centralsd|csd/i.test(
							simplifiedName,
						) ||
						simplifiedName === "eastquogueschool"
					) {
						const status = parseStatus(statusText);
						newClosings.set(name, status);
					}
				}

				setClosings(newClosings);
				setLastUpdated(new Date());
				setLoading(false);
			} catch (error) {
				console.error("Failed to fetch closings:", error);
				setLoading(false);
			}
		},
		[selectedDate],
	);

	const initialFetchDone = useRef(false);

	useEffect(() => {
		if (!initialFetchDone.current) {
			initialFetchDone.current = true;
			fetchClosings(true);
		}
	}, [fetchClosings]);

	useEffect(() => {
		if (initialFetchDone.current && dateOptions.length > 0) {
			fetchClosings(false);
		}
	}, [fetchClosings, dateOptions.length]);

	useEffect(() => {
		const interval = setInterval(() => fetchClosings(false), 60000);
		return () => clearInterval(interval);
	}, [fetchClosings]);

	const getDistrictStatus = useCallback(
		(districtName: string): DistrictStatus => {
			const normalizedDistrict = normalize(districtName);

			let bestMatch: { status: DistrictStatus; score: number } | null = null;

			for (const [news12Name, status] of closings) {
				const normalizedNews12 = normalize(news12Name);

				// Check manual overrides first
				for (const [overrideKey, overrideValue] of Object.entries(
					MANUAL_OVERRIDES,
				)) {
					if (
						normalizedNews12.includes(overrideKey) &&
						normalizedDistrict.includes(overrideValue)
					) {
						return status;
					}
				}

				// Bidirectional matching - either name contains the other
				if (
					normalizedDistrict.includes(normalizedNews12) ||
					normalizedNews12.includes(normalizedDistrict)
				) {
					// Score by how close the lengths are (prefer closer matches)
					const score =
						Math.min(normalizedDistrict.length, normalizedNews12.length) /
						Math.max(normalizedDistrict.length, normalizedNews12.length);

					if (bestMatch === null || score > bestMatch.score) {
						bestMatch = { status, score };
					}
				}
			}

			return bestMatch?.status ?? "open";
		},
		[closings],
	);

	return {
		closings,
		dateOptions,
		selectedDate,
		setSelectedDate,
		loading,
		lastUpdated,
		getDistrictStatus,
		refresh: () => fetchClosings(false),
	};
};

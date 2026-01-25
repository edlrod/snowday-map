import { useEffect, useState } from "react";
import type { DistrictsGeoJSON } from "../types";

export const useDistricts = () => {
	const [districts, setDistricts] = useState<DistrictsGeoJSON | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetch("districts.geojson")
			.then((res) => res.json())
			.then((data: DistrictsGeoJSON) => {
				setDistricts(data);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, []);

	return { districts, loading, error };
};

import { useEffect, useState } from "react";
import type { District } from "../types";

export const useDistricts = () => {
	const [districts, setDistricts] = useState<District[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetch("/districts.json")
			.then((res) => res.json())
			.then((data: District[]) => {
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

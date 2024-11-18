import axios from "axios";
import { useEffect, useState } from "react";
import PosterSlider from "../../components/shared/PosterSlider";

export default function Movies() {
	const serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}/movie`;
	const [movies, setMovies] = useState([]);
	useEffect(() => {
		async function getMovies() {
			try {
				const response = await axios.get(`${serverUrl}`);
				const responseData = response.data;
				console.log(responseData);

				setMovies(responseData);
			} catch (err) {
				console.log(err);
			}
		}

		getMovies();
	}, []);

	return (
		<main className="mx-16 my-8">
			<h1>Movies Available</h1>
			<PosterSlider posters={movies} />
		</main>
	);
}

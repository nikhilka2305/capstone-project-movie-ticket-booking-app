import { useEffect, useState } from "react";
import PosterSlider from "../../components/shared/PosterSlider";
import axios from "axios";

export default function Home() {
	const serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}/movie`;
	const [nowRunningMovies, setNowRunningMovies] = useState([]);
	const [newReleaseMovies, setNewReleaseMovies] = useState([]);
	useEffect(() => {
		async function getNowRunningMovies() {
			try {
				const response = await axios.get(`${serverUrl}?filter=nowrunning`);
				const responseData = response.data;
				console.log(response);
				console.log(responseData);

				setNowRunningMovies(responseData);
			} catch (err) {
				console.log(err);
			}
		}
		async function getNewReleaseMovies() {
			try {
				const response = await axios.get(`${serverUrl}?filter=newreleases`);
				const responseData = response.data;

				setNewReleaseMovies(responseData);
			} catch (err) {
				console.log(err);
			}
		}

		getNowRunningMovies();
		getNewReleaseMovies();
	}, []);

	return (
		<main className="mx-16 my-8">
			<h1 className="text-center text-4xl mt- 4">
				Welcome to Movie Booking System App
			</h1>

			<PosterSlider heading="Now Playing" posters={nowRunningMovies} />

			<PosterSlider heading="Coming Soon" posters={newReleaseMovies} />
		</main>
	);
}

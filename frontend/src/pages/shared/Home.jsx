import { useEffect, useState } from "react";
import PosterSlider from "../../components/shared/PosterSlider";
import axios from "axios";
import { Pagination } from "../../components/shared/Pagination";

export default function Home() {
	const serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}/movie`;
	const [nowRunningMovies, setNowRunningMovies] = useState([]);

	const [loading, setLoading] = useState(true);
	const [pageNowRunning, setPageNowRunning] = useState(1);
	const [totalPagesNowRunning, setTotalPagesNowRunning] = useState(1);
	const [newReleaseMovies, setNewReleaseMovies] = useState([]);
	const [pageNewRelease, setPageNewRelease] = useState(1);
	const [totalPagesNewRelease, setTotalPagesNewRelease] = useState(1);
	useEffect(() => {
		setLoading(true);
		async function getNowRunningMovies() {
			try {
				const response = await axios.get(`${serverUrl}?filter=nowrunning`, {
					params: { page: pageNowRunning, limit: 5 },
				});
				const responseData = response.data;
				// console.log(response);
				console.log(responseData.movies);

				setNowRunningMovies(responseData.movies);
				setTotalPagesNowRunning(responseData.totalPages);
				setLoading(false);
			} catch (err) {
				console.log(err);
			}
		}
		async function getNewReleaseMovies() {
			setLoading(true);
			try {
				const response = await axios.get(`${serverUrl}?filter=newreleases`, {
					params: { page: pageNewRelease, limit: 5 },
				});
				const responseData = response.data;
				console.log(responseData.movies);
				setNewReleaseMovies(responseData.movies);
				setTotalPagesNewRelease(responseData.totalPages);
				setLoading(false);
			} catch (err) {
				console.log(err);
			}
		}

		getNowRunningMovies();
		getNewReleaseMovies();
	}, [pageNewRelease, pageNowRunning]);

	return (
		<main className="mx-16 my-8">
			<h1 className="text-center text-4xl mt- 4">
				Welcome to Movie Booking System App
			</h1>
			{loading && <div>Loading...</div>}
			<PosterSlider heading="Now Playing" posters={nowRunningMovies}>
				<Pagination
					page={pageNowRunning}
					setPage={setPageNowRunning}
					totalPages={totalPagesNowRunning}
				/>
			</PosterSlider>
			/
			<PosterSlider heading="Coming Soon" posters={newReleaseMovies}>
				<Pagination
					page={pageNewRelease}
					setPage={setPageNewRelease}
					totalPages={totalPagesNewRelease}
				/>
			</PosterSlider>
		</main>
	);
}

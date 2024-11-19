import { useEffect, useState } from "react";
import PosterSlider from "../../components/shared/PosterSlider";
import axios from "axios";
import { Pagination } from "../../components/shared/Pagination";
import Poster from "../../components/shared/Poster";
import { Link } from "react-router-dom";

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
			<PosterSlider heading="Now Playing">
				<section className="w-full h-full flex justify-evenly gap-2">
					{nowRunningMovies.map((item, i) => (
						<Link
							to={`movies/${item.movieId}`}
							key={i}
							className="w-full md:w-2/3 lg:w-1/4 xl:w-1/5"
						>
							<Poster url={item.posterImage} />
						</Link>
					))}
				</section>
				<Pagination
					page={pageNowRunning}
					setPage={setPageNowRunning}
					totalPages={totalPagesNowRunning}
				/>
			</PosterSlider>
			/
			<PosterSlider heading="New Releases">
				<section className="w-full h-full flex  justify-evenly">
					{newReleaseMovies.map((item, i) => (
						<Link
							to={`movies/${item.movieId}`}
							key={i}
							className="w-full md:w-2/3 lg:w-1/4 xl:w-1/5"
						>
							<Poster url={item.posterImage} />
						</Link>
					))}
				</section>

				<Pagination
					page={pageNewRelease}
					setPage={setPageNewRelease}
					totalPages={totalPagesNewRelease}
				/>
			</PosterSlider>
		</main>
	);
}

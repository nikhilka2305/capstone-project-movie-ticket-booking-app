import { useEffect, useState } from "react";
import PosterSlider from "../../components/shared/PosterSlider";
import axios from "axios";
import { Pagination } from "../../components/shared/Pagination";
import Poster from "../../components/shared/Poster";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Skeleton from "../../components/shared/Skeleton";

export default function Home() {
	const [nowRunningMovies, setNowRunningMovies] = useState([]);

	const [loading, setLoading] = useState(true);
	const [pageNowRunning, setPageNowRunning] = useState(1);
	const [totalPagesNowRunning, setTotalPagesNowRunning] = useState(1);
	const [newReleaseMovies, setNewReleaseMovies] = useState([]);
	const [pageNewRelease, setPageNewRelease] = useState(1);
	const [totalPagesNewRelease, setTotalPagesNewRelease] = useState(1);
	useEffect(() => {
		const serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}/movie`;
		setLoading(true);
		async function getNowRunningMovies() {
			try {
				const response = await axios.get(`${serverUrl}?filter=nowrunning`, {
					params: { page: pageNowRunning, limit: 4 },
				});
				const responseData = response.data;

				setNowRunningMovies(responseData.movies);
				setTotalPagesNowRunning(responseData.totalPages);
				setLoading(false);
			} catch (err) {
				toast.error("Unable to fetch now running movies");
			}
		}
		async function getNewReleaseMovies() {
			setLoading(true);
			try {
				const response = await axios.get(`${serverUrl}?filter=newreleases`, {
					params: { page: pageNewRelease, limit: 4 },
				});
				const responseData = response.data;

				setNewReleaseMovies(responseData.movies);
				setTotalPagesNewRelease(responseData.totalPages);
				setLoading(false);
			} catch (err) {
				toast.error("Unable to fetch new release movies");
			}
		}

		getNowRunningMovies();
		getNewReleaseMovies();
	}, [pageNewRelease, pageNowRunning]);

	return (
		<main className="mx-16 my-8 flex flex-col gap-4 items-center">
			{loading && <Skeleton />}
			{!loading && (
				<>
					<h2 className="text-center my-4">Now Running</h2>
					{nowRunningMovies.length === 0 && (
						<h2 className="text-2xl text-center mt-8 mx-auto">
							No now running movies
						</h2>
					)}
					<PosterSlider posters={nowRunningMovies} classes="">
						{nowRunningMovies.map((item, i) => (
							<Link to={`/movies/${item.movieId}`} key={i}>
								<Poster url={item.posterImage} title={item.movieName} />
							</Link>
						))}
					</PosterSlider>
					<Pagination
						page={pageNowRunning}
						setPage={setPageNowRunning}
						totalPages={totalPagesNowRunning}
					/>
					<h2 className="text-center my-4">New Releases</h2>
					{newReleaseMovies.length === 0 && (
						<h2 className="text-2xl text-center mt-8 mx-auto">
							No new release movies
						</h2>
					)}
					<PosterSlider posters={newReleaseMovies} classes="">
						{newReleaseMovies.map((item, i) => (
							<Link to={`/movies/${item.movieId}`} key={i}>
								<Poster url={item.posterImage} title={item.movieName} />
							</Link>
						))}
					</PosterSlider>
					<Pagination
						page={pageNewRelease}
						setPage={setPageNewRelease}
						totalPages={totalPagesNewRelease}
					/>
				</>
			)}
		</main>
	);
}

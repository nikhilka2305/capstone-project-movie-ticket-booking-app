import axios from "axios";
import { useEffect, useState } from "react";
import PosterSlider from "../../components/shared/PosterSlider";
import { Pagination } from "../../components/shared/Pagination";
import Poster from "../../components/shared/Poster";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Skeleton from "../../components/shared/Skeleton";

export default function Movies() {
	const [movies, setMovies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1); // Current page
	const [totalPages, setTotalPages] = useState(1);
	useEffect(() => {
		setLoading(true);
		async function getMovies() {
			try {
				const serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}/movie`;
				const response = await axios.get(`${serverUrl}`, {
					params: { page, limit: 8 },
				});
				const responseData = response.data;

				setMovies(responseData.movies);
				setTotalPages(responseData.totalPages);
				setLoading(false);
			} catch (err) {
				toast.error("Unable to fetch movies");
			}
		}

		getMovies();
	}, [page]);

	return (
		<main className="py-8 px-8 flex flex-col items-center  min-h-svh w-full">
			<h1 className="text-2xl mb-lg-2 my-4">Movies Available</h1>
			{loading && <Skeleton />}
			{!loading && (
				<>
					{movies.length === 0 && (
						<h2 className="text-2xl text-center mt-8 mx-auto">
							No Movies available
						</h2>
					)}
					<PosterSlider posters={movies} classes="">
						{movies.map((item, i) => (
							<Link to={`/movies/${item.movieId}`} key={i}>
								<Poster url={item.posterImage} title={item.movieName} />
							</Link>
						))}
					</PosterSlider>
					<Pagination page={page} setPage={setPage} totalPages={totalPages} />
				</>
			)}
		</main>
	);
}

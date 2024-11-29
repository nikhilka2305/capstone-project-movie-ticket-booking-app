import axios from "axios";
import { useEffect, useState } from "react";
import PosterSlider from "../../components/shared/PosterSlider";
import { Pagination } from "../../components/shared/Pagination";
import Poster from "../../components/shared/Poster";
import { Link, useParams } from "react-router-dom";
import { formatDate } from "../../utils/dateFormatter";

export default function Shows() {
	const [shows, setShows] = useState([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1); // Current page
	const [totalPages, setTotalPages] = useState(1);
	const { movieid, theaterid } = useParams();
	console.log(movieid, theaterid);
	useEffect(() => {
		setLoading(true);
		let serverUrl;
		if (movieid) {
			serverUrl = `${
				import.meta.env.VITE_SERVER_BASE_URL
			}/movie/${movieid}/shows`;
		} else if (theaterid) {
			serverUrl = `${
				import.meta.env.VITE_SERVER_BASE_URL
			}/theater/${theaterid}/shows`;
		} else {
			serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}/show`;
		}

		async function getShows() {
			try {
				const response = await axios.get(`${serverUrl}`, {
					params: { page, limit: 8 },
				});
				const responseData = response.data;
				console.log(responseData);
				const shows = responseData.shows;
				setShows(shows);
				setTotalPages(responseData.totalPages);
				setLoading(false);
			} catch (err) {
				console.log(err);
			}
		}
		getShows();
	}, [page]);
	return (
		<main className="py-8 px-8 flex flex-col items-center  min-h-svh w-full">
			<h1 className="text-2xl mb-lg-2 my-4">Shows Available</h1>
			{loading && <div>Loading...</div>}
			<PosterSlider posters={shows} classes="">
				{shows.map((item, i) => (
					<Link to={`/shows/${item.showId}`} key={i}>
						<Poster
							url={item.movie.posterImage}
							title={item.movie.movieName}
							description={item.theater.theaterName}
							otherInfo={formatDate(new Date(item.showTimeIST))}
						/>
					</Link>
				))}
			</PosterSlider>
			<Pagination page={page} setPage={setPage} totalPages={totalPages} />
		</main>
	);
}

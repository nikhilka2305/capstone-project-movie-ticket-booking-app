import axios from "axios";
import { useEffect, useState } from "react";
import PosterSlider from "../../components/shared/PosterSlider";
import { Pagination } from "../../components/shared/Pagination";
import { Link } from "react-router-dom";
import Poster from "../../components/shared/Poster";

function Theaters() {
	const serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}/theater`;
	const [theaters, setTheaters] = useState([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1); // Current page
	const [totalPages, setTotalPages] = useState(1);

	useState(() => {
		setLoading(true);
		async function getTheaters() {
			try {
				const response = await axios.get(`${serverUrl}`, {
					params: { page, limit: 4 },
				});
				const responseData = response.data;
				console.log(responseData);

				setTheaters(responseData.theaters);
				setTotalPages(responseData.totalPages);
				setLoading(false);
			} catch (err) {
				console.log(err);
			}
		}
		getTheaters();
	}, [page]);
	return (
		<main className="py-8 px-8 flex flex-col items-center justify-start min-h-svh w-full gap-8">
			<h1 className="text-2xl ">Theaters</h1>
			{loading && <div>Loading...</div>}
			<PosterSlider posters={theaters} classes="h-full">
				{theaters.map((item, i) => (
					<Link to={`/theaters/${item.theaterId}`} key={i}>
						<Poster url={item.images[0]} title={item.theaterName} />
					</Link>
				))}
			</PosterSlider>
			<Pagination page={page} setPage={setPage} totalPages={totalPages} />
		</main>
	);
}

export default Theaters;

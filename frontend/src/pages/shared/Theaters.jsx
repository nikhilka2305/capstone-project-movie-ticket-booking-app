import axios from "axios";
import { useEffect, useState } from "react";
import PosterSlider from "../../components/shared/PosterSlider";
import { Pagination } from "../../components/shared/Pagination";
import { Link } from "react-router-dom";
import Poster from "../../components/shared/Poster";
import toast from "react-hot-toast";
import Skeleton from "../../components/shared/Skeleton";

function Theaters() {
	const [theaters, setTheaters] = useState([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1); // Current page
	const [totalPages, setTotalPages] = useState(1);

	useEffect(() => {
		setLoading(true);
		async function getTheaters() {
			try {
				const serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}/theater`;
				const response = await axios.get(`${serverUrl}`, {
					params: { page, limit: 8 },
				});
				const responseData = response.data;

				setTheaters(responseData.theaters);
				setTotalPages(responseData.totalPages);
				setLoading(false);
			} catch (err) {
				toast.error("Unable to fetch theater data");
			}
		}
		getTheaters();
	}, [page]);
	return (
		<main className="py-8 px-8 flex flex-col items-center justify-start min-h-svh w-full gap-8">
			<h1 className="text-2xl ">Theaters</h1>
			{loading && <Skeleton />}
			{!loading && (
				<>
					{theaters.length === 0 && (
						<h2 className="text-2xl text-center mt-8 mx-auto">
							No Theaters available
						</h2>
					)}
					<PosterSlider posters={theaters} classes="h-full">
						{theaters?.map((item, i) => (
							<Link to={`/theaters/${item.theaterId}`} key={i}>
								<Poster url={item.images[0]} title={item.theaterName} />
							</Link>
						))}
					</PosterSlider>
					<Pagination page={page} setPage={setPage} totalPages={totalPages} />
				</>
			)}
		</main>
	);
}

export default Theaters;

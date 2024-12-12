import { useContext, useEffect, useState } from "react";

import { Pagination } from "../../components/shared/Pagination";

import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";
import PosterSlider from "../../components/shared/PosterSlider";
import Poster from "../../components/shared/Poster";
import Skeleton from "../../components/shared/Skeleton";
import GoBackLink from "../../components/shared/GoBackLink";

function ManageMovies() {
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1); // Current page
	const [totalPages, setTotalPages] = useState(1);
	const { user } = useContext(AuthContext);
	const [movies, setMovies] = useState([]);
	const navigate = useNavigate();
	useEffect(() => {
		setLoading(true);
		async function getMovies() {
			if (user.role !== "Admin") navigate("/movies");
			try {
				const serverUrl = `${
					import.meta.env.VITE_SERVER_BASE_URL
				}/admin/movies`;
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
		setLoading(false);
	}, [page]);
	return (
		<main className="py-8 px-8 flex flex-col items-center  min-h-svh w-full">
			<GoBackLink to={`/admin/${user.loggedUserId}`} />
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
							<Link to={`${item.movieId}/`} key={i}>
								<Poster
									url={item.posterImage}
									title={item.movieName}
									otherInfo={`Status: ${item.adminApprovalStatus}`}
								/>
							</Link>
						))}
					</PosterSlider>
					<Pagination page={page} setPage={setPage} totalPages={totalPages} />
				</>
			)}
		</main>
	);
}

export default ManageMovies;

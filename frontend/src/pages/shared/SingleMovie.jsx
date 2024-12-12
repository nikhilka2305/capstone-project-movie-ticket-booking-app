import { useContext, useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Card from "../../components/shared/Card";
import { AuthContext } from "../../context/AuthContext";
import AverageRating from "../../components/shared/formcomponents/AverageRating";
import toast from "react-hot-toast";
import Skeleton from "../../components/shared/Skeleton";

function SingleMovie() {
	const { user } = useContext(AuthContext);
	const [movie, setMovie] = useState();
	const [movieRating, setMovieRating] = useState({
		averageRating: 0,
		reviewCount: 0,
	});
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const { movieid } = useParams();
	const tagsClasses =
		"text-sm text-gray-600 rounded bg-blue-gray-50 inline pl-2 p-1";

	useEffect(() => {
		const serverUrl = `${
			import.meta.env.VITE_SERVER_BASE_URL
		}/movie/${movieid}`;
		setLoading(true);
		async function getMovie() {
			try {
				const response = await axios.get(`${serverUrl}`);
				const responseData = response.data;

				const reviewResponse = await axios.get(`${serverUrl}/avgrating`);

				setMovie(responseData);
				setMovieRating({
					averageRating: reviewResponse.data.averageRating,
					reviewCount: reviewResponse.data.reviewCount,
				});
			} catch (err) {
				toast.error("Unable to fetch movie details");
				navigate("/movies");
			}
		}
		setLoading(false);
		getMovie();
	}, [movieid, navigate]);
	return (
		<>
			{loading && <Skeleton />}
			{!loading && movie && (
				<Card
					loading={loading}
					title={movie.movieName}
					image={movie.posterImage}
					onClick={() => navigate("shows")}
					btnLabel="Browse Shows"
				>
					<div>
						<div className="tags flex flex-wrap gap-2 mb-4">
							<p
								className={`${tagsClasses} dark:bg-gray-600 dark:text-gray-50`}
							>
								{movie.genre}
							</p>
							<p
								className={`${tagsClasses} dark:bg-gray-600 dark:text-gray-50`}
							>
								{movie.language}
							</p>
							<p
								className={`${tagsClasses} dark:bg-gray-600 dark:text-gray-50`}
							>
								{movie.movieduration} mins
							</p>
							<p
								className={`${tagsClasses} dark:bg-gray-600 dark:text-gray-50`}
							>
								{new Date(movie.releaseDate).toLocaleDateString("en-IN")}
							</p>
							<p
								className={`${tagsClasses} dark:bg-gray-600 dark:text-gray-50`}
							>
								Rating: <span className="font-bold">{movie.rating}</span>
							</p>
						</div>
						<p className="text-lg leading-relaxed dark:text-slate-50 mb-4">
							{movie.movieDescription}
						</p>
						<ul className="text-sm text-gray-600 dark:text-gray-300 mb-6 flex gap-4 flex-wrap">
							{" "}
							{movie.movieCast.map((cast, i) => (
								<li
									key={i}
									className="bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-md"
								>
									{cast}
								</li>
							))}
						</ul>
						<div className="text-base text-gray-700 dark:text-gray-300 mb-6">
							<span className=" font-bold">Directed By: </span> {movie.director}
						</div>
					</div>
					<div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
						<div className=" text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
							<span>Rating:</span>
							<span>
								{movieRating.averageRating > 0 ? (
									<AverageRating rating={movieRating.averageRating} />
								) : (
									"No Rating"
								)}
							</span>
						</div>
						<div className=" text-sm text-gray-600 dark:text-gray-400">
							{movieRating.reviewCount > 0
								? `${movieRating.reviewCount} reviews`
								: "No Reviews"}
						</div>
					</div>
					<div className="flex gap-4">
						{user.role === "User" && (
							<Link
								to={"reviews/addreview"}
								className="py-2 px-4 rounded-md border text-center bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-all"
							>
								Add review
							</Link>
						)}
						<Link
							to={"reviews"}
							className="py-2 px-4 rounded-md border text-center bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200 transition-all"
						>
							View reviews
						</Link>
					</div>
				</Card>
			)}
		</>
	);
}

export default SingleMovie;

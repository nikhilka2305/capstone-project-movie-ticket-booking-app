import { useContext, useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Card from "../../components/shared/Card";
import { AuthContext } from "../../context/AuthContext";
import AverageRating from "../../components/shared/formcomponents/AverageRating";
import toast from "react-hot-toast";

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
			{loading && (
				<div className="flex w-52 flex-col gap-4">
					<div className="skeleton h-32 w-full"></div>
					<div className="skeleton h-4 w-28"></div>
					<div className="skeleton h-4 w-full"></div>
					<div className="skeleton h-4 w-full"></div>
				</div>
			)}
			{!loading && movie && (
				<Card
					loading={loading}
					title={movie.movieName}
					image={movie.posterImage}
					onClick={() => navigate("shows")}
					btnLabel="Browse Shows"
				>
					<div>
						<div className="tags flex justify-start gap-2">
							<p className={tagsClasses}>{movie.genre}</p>
							<p className={tagsClasses}>{movie.language}</p>
							<p className={tagsClasses}>{movie.movieduration} mins</p>
							<p className={tagsClasses}>
								{new Date(movie.releaseDate).toLocaleDateString("en-IN")}
							</p>
							<p className={tagsClasses}>
								Rating: <span className="font-bold">{movie.rating}</span>
							</p>
						</div>
						<p className="text-lg  mt-2 leading-relaxed">
							{movie.movieDescription}
						</p>
						<ul className="text-sm text-gray-600 mt-2 leading-relaxed flex gap-4 pt-4 flex-wrap">
							{" "}
							{movie.movieCast.map((cast, i) => (
								<li key={i} className="bg-gray-200 py-1 px-2 rounded-md">
									{cast}
								</li>
							))}
						</ul>
						<div className="mt-4 text-lg">
							<span className=" font-bold">Directed By: </span> {movie.director}
						</div>
					</div>
					<div className="flex items-center">
						<div className=" text-lg md:text-lg mt-1 flex gap-2">
							<span>Rating:</span>
							<span>
								{movieRating.averageRating > 0 ? (
									<AverageRating rating={movieRating.averageRating} />
								) : (
									"No Rating"
								)}
							</span>
						</div>
						<div className=" ml-2 text-sm md:text-base mt-1">
							{movieRating.reviewCount > 0
								? `${movieRating.reviewCount} reviews`
								: "No Reviews"}
						</div>
					</div>
					<div className="flex gap-8">
						{user.role === "User" && (
							<Link
								to={"reviews/addreview"}
								className="p-1 rounded-md border w-32 text-center"
							>
								Add review
							</Link>
						)}
						<Link
							to={"reviews"}
							className="p-1 rounded-md border w-32 text-center"
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

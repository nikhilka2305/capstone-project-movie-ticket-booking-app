import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Card from "../../components/shared/Card";

function SingleMovie() {
	const [movie, setMovie] = useState();
	const [movieRating, setMovieRating] = useState({
		averageRating: 0,
		reviewCount: 0,
	});
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const { movieid } = useParams();
	const tagsClasses =
		"text-sm text-gray-500 rounded bg-blue-gray-50 inline pl-2 p-1";
	console.log(movieid);

	useEffect(() => {
		const serverUrl = `${
			import.meta.env.VITE_SERVER_BASE_URL
		}/movie/${movieid}`;
		setLoading(true);
		async function getMovie() {
			try {
				const response = await axios.get(`${serverUrl}`);
				const responseData = response.data;
				console.log(responseData);
				const reviewResponse = await axios.get(`${serverUrl}/avgrating`);
				console.log(reviewResponse.data);
				setMovie(responseData);
				setMovieRating({
					averageRating: reviewResponse.data.averageRating,
					reviewCount: reviewResponse.data.reviewCount,
				});
			} catch (err) {
				console.log(err);
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
				>
					<div>
						<div className="tags flex justify-start gap-2">
							<p className={tagsClasses}>{movie.genre}</p>
							<p className={tagsClasses}>{movie.language}</p>
							<p className={tagsClasses}>
								{new Date(movie.releaseDate).toLocaleDateString("en-IN")}
							</p>
							<p className={tagsClasses}>
								Rating: <span className="font-bold">{movie.rating}</span>
							</p>
						</div>
						<p className="text-lg text-gray-400 mt-2 leading-relaxed">
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
						<div className="mt-4 text-lg text-gray-700">
							<span className="text-gray-500 font-bold">Directed By: </span>{" "}
							{movie.director}
						</div>
					</div>
					<div className="flex items-center">
						<div className="text-gray-900 text-lg md:text-lg mt-1 flex gap-2">
							<span>Rating:</span>
							<span className="text-blue-gray-800">
								{movieRating.averageRating > 0
									? `${movieRating.averageRating} / 5`
									: "No Rating"}
							</span>
						</div>
						<div className="text-gray-600 ml-2 text-sm md:text-base mt-1">
							{movieRating.reviewCount > 0
								? `${movieRating.reviewCount} reviews`
								: "No Reviews"}
						</div>
					</div>
				</Card>
			)}
		</>
	);
}

export default SingleMovie;

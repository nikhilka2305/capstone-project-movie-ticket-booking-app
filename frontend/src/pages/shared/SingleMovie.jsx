import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Card from "../../components/shared/Card";
import Button from "../../components/shared/formcomponents/Button";

function SingleMovie() {
	const [movie, setMovie] = useState();
	const [movieRating, setMovieRating] = useState({
		averageRating: 0,
		reviewCount: 0,
	});
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const { movieid } = useParams();
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
			{/* <div className="py-8 px-8 w-2/3 min-h-full mx-auto bg-white rounded-xl shadow-lg space-y-2 sm:py-4 flex flex-col gap-8 sm:items-center sm:space-y-0 sm:space-x-6 my-16"> */}

			{loading && <div>Loading...</div>}
			{!loading && movie && (
				<Card movie={movie} loading={loading}>
					<img
						className="w-full max-h-[400px] object-cover md:w-2/5"
						src={movie.posterImage}
						alt={movie.movieName}
					/>
					<div className="">
						<div className="p-5 pb-10">
							<h1 className="text-2xl font-semibold text-gray-800 mt-4">
								{movie.movieName}
							</h1>
							<p className="text-sm text-gray-500 rounded bg-blue-gray-50 inline p-1">
								{movie.genre}
							</p>
							<p className="text-xl text-gray-400 mt-2 leading-relaxed">
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
						</div>
						<div className="bg-blue-50 p-5">
							<div className="sm:flex sm:justify-between">
								<div>
									<div className="ml-2 text-lg text-gray-700">
										<span className="text-gray-900 font-bold">
											Directed By:{" "}
										</span>{" "}
										{movie.director}
									</div>
									<div className="flex items-center">
										{/* <div className="flex">
											<svg
												className="w-4 h-4 mx-px fill-current text-green-600"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 14 14"
											>
												<path d="M6.43 12l-2.36 1.64a1 1 0 0 1-1.53-1.11l.83-2.75a1 1 0 0 0-.35-1.09L.73 6.96a1 1 0 0 1 .59-1.8l2.87-.06a1 1 0 0 0 .92-.67l.95-2.71a1 1 0 0 1 1.88 0l.95 2.71c.13.4.5.66.92.67l2.87.06a1 1 0 0 1 .59 1.8l-2.3 1.73a1 1 0 0 0-.34 1.09l.83 2.75a1 1 0 0 1-1.53 1.1L7.57 12a1 1 0 0 0-1.14 0z"></path>
											</svg>
											<svg
												className="w-4 h-4 mx-px fill-current text-green-600"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 14 14"
											>
												<path d="M6.43 12l-2.36 1.64a1 1 0 0 1-1.53-1.11l.83-2.75a1 1 0 0 0-.35-1.09L.73 6.96a1 1 0 0 1 .59-1.8l2.87-.06a1 1 0 0 0 .92-.67l.95-2.71a1 1 0 0 1 1.88 0l.95 2.71c.13.4.5.66.92.67l2.87.06a1 1 0 0 1 .59 1.8l-2.3 1.73a1 1 0 0 0-.34 1.09l.83 2.75a1 1 0 0 1-1.53 1.1L7.57 12a1 1 0 0 0-1.14 0z"></path>
											</svg>
											<svg
												className="w-4 h-4 mx-px fill-current text-green-600"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 14 14"
											>
												<path d="M6.43 12l-2.36 1.64a1 1 0 0 1-1.53-1.11l.83-2.75a1 1 0 0 0-.35-1.09L.73 6.96a1 1 0 0 1 .59-1.8l2.87-.06a1 1 0 0 0 .92-.67l.95-2.71a1 1 0 0 1 1.88 0l.95 2.71c.13.4.5.66.92.67l2.87.06a1 1 0 0 1 .59 1.8l-2.3 1.73a1 1 0 0 0-.34 1.09l.83 2.75a1 1 0 0 1-1.53 1.1L7.57 12a1 1 0 0 0-1.14 0z"></path>
											</svg>
											<svg
												className="w-4 h-4 mx-px fill-current text-green-600"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 14 14"
											>
												<path d="M6.43 12l-2.36 1.64a1 1 0 0 1-1.53-1.11l.83-2.75a1 1 0 0 0-.35-1.09L.73 6.96a1 1 0 0 1 .59-1.8l2.87-.06a1 1 0 0 0 .92-.67l.95-2.71a1 1 0 0 1 1.88 0l.95 2.71c.13.4.5.66.92.67l2.87.06a1 1 0 0 1 .59 1.8l-2.3 1.73a1 1 0 0 0-.34 1.09l.83 2.75a1 1 0 0 1-1.53 1.1L7.57 12a1 1 0 0 0-1.14 0z"></path>
											</svg>
											<svg
												className="w-4 h-4 mx-px fill-current text-green-600"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 14 14"
											>
												<path d="M6.43 12l-2.36 1.64a1 1 0 0 1-1.53-1.11l.83-2.75a1 1 0 0 0-.35-1.09L.73 6.96a1 1 0 0 1 .59-1.8l2.87-.06a1 1 0 0 0 .92-.67l.95-2.71a1 1 0 0 1 1.88 0l.95 2.71c.13.4.5.66.92.67l2.87.06a1 1 0 0 1 .59 1.8l-2.3 1.73a1 1 0 0 0-.34 1.09l.83 2.75a1 1 0 0 1-1.53 1.1L7.57 12a1 1 0 0 0-1.14 0z"></path>
											</svg>
										</div> */}
										<div className="text-gray-900 ml-2 text-lg md:text-lg mt-1 flex gap-2">
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
								</div>
								<Button label="See Shows" />
							</div>
							<div className="ml-2 mt-3 text-gray-600 text-sm md:text-sm">
								<div>{movie.language}</div>
								<div>
									{new Date(movie.releaseDate).toLocaleDateString("en-IN")}
								</div>
								<div>
									Rating <span className="font-bold">{movie.rating}</span>
								</div>
							</div>
						</div>
					</div>
				</Card>
			)}
		</>
	);
}

export default SingleMovie;

import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Card from "../../components/shared/Card";
import Button from "../../components/shared/formcomponents/Button";
import { useEffect, useState } from "react";
import { formatDate } from "../../utils/dateFormatter";
import { SeatSelection } from "./SeatGrid";

function SingleShow() {
	const [show, setShow] = useState();
	const [movieRating, setMovieRating] = useState({
		averageRating: 0,
		reviewCount: 0,
	});
	const [theaterRating, setTheaterRating] = useState({
		averageRating: 0,
		reviewCount: 0,
	});
	const [theaterSeats, setTheaterSeats] = useState({
		rows: 5,
		columns: 6,
		bookedSeats: ["4-1"],
		seatClasses: [
			{ className: "VIP", price: 500, rows: [] },
			{ className: "Regular", price: 300, rows: [] },
		], // Sample booked seats
	});
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	const { showid } = useParams();
	const tagsClasses =
		"text-sm text-gray-500 rounded bg-blue-gray-50 inline pl-2 p-1 text-center";
	console.log(showid);

	useEffect(() => {
		const serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}/show/${showid}`;
		setLoading(true);
		async function getShow() {
			try {
				const response = await axios.get(`${serverUrl}`);
				const responseData = response.data;
				console.log(responseData);
				setShow(responseData);
				const theaterData = responseData.theater;

				setTheaterSeats({
					rows: theaterData.seats.rows,
					columns: theaterData.seats.seatsPerRow,
					bookedSeats: ["6-6", "5-5", "4-4"],
					seatClasses: theaterData.seatClasses,
				});

				console.log(theaterData);
				const movieReviewResponse = await axios.get(
					`${import.meta.env.VITE_SERVER_BASE_URL}/movie/${
						responseData.movie.movieId
					}/avgrating`
				);
				const theaterReviewResponse = await axios.get(
					`${import.meta.env.VITE_SERVER_BASE_URL}/theater/${
						responseData.theater.theaterId
					}/avgrating`
				);
				console.log(movieReviewResponse.data);
				console.log(theaterReviewResponse.data);
				setMovieRating({
					averageRating: movieReviewResponse.data.averageRating,
					reviewCount: movieReviewResponse.data.reviewCount,
				});
				setTheaterRating({
					averageRating: theaterReviewResponse.data.averageRating,
					reviewCount: theaterReviewResponse.data.reviewCount,
				});

				// setTheaterRating({
				// 	averageRating: reviewResponse.data.averageRating,
				// 	reviewCount: reviewResponse.data.reviewCount,
				// });
			} catch (err) {
				console.log(err);
				navigate("/theaters");
			}
		}
		setLoading(false);
		getShow();
	}, [showid, navigate]);

	return (
		<>
			{loading && <div>Loading...</div>}
			{!loading && show && (
				<>
					<Card
						loading={loading}
						title={show.movie.movieName}
						subtitle={`Show Date & Time: ${formatDate(
							new Date(show.showTimeIST)
						)} Theater: ${show.theater.theaterName}`}
						image={show.movie.posterImage}
					>
						<div>
							<div className="tags flex justify-start gap-2">
								<p className={tagsClasses}>{show.movie.genre}</p>
								<p className={tagsClasses}>{show.movie.language}</p>
								<p className={tagsClasses}>
									{new Date(show.movie.releaseDate).toLocaleDateString("en-IN")}
								</p>
								<p className={tagsClasses}>
									Rating: <span className="font-bold">{show.movie.rating}</span>
								</p>
							</div>
							<p className="text-lg text-gray-400 mt-2 leading-relaxed">
								{show.movie.movieDescription}
							</p>
							<ul className="text-sm text-gray-600 mt-2 leading-relaxed flex gap-4 pt-4 flex-wrap">
								{" "}
								{show.movie.movieCast.map((cast, i) => (
									<li key={i} className="bg-gray-200 py-1 px-2 rounded-md">
										{cast}
									</li>
								))}
							</ul>
							<div className="mt-4 text-lg text-gray-700">
								<span className="text-gray-500 font-bold">Directed By: </span>{" "}
								{show.movie.director}
							</div>
						</div>
						<h3>Movie Rating</h3>
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
						<h3>Theater Rating</h3>
						<div className="flex items-center">
							<div className="text-gray-900 text-lg md:text-lg mt-1 flex gap-2">
								<span>Rating:</span>
								<span className="text-blue-gray-800">
									{theaterRating.averageRating > 0
										? `${theaterRating.averageRating} / 5`
										: "No Rating"}
								</span>
							</div>
							<div className="text-gray-600 ml-2 text-sm md:text-base mt-1">
								{theaterRating.reviewCount > 0
									? `${theaterRating.reviewCount} reviews`
									: "No Reviews"}
							</div>
						</div>
					</Card>
					{/* md:flex-row */}
					<div className="card bg-base-100 w-full shadow-xl mx-auto">
						<div className="card-body">
							<h2 className="card-title mx-auto">Seat Availablity</h2>
						</div>
						<SeatSelection theaterSeats={theaterSeats} />
					</div>
				</>
			)}
		</>
	);
}

export default SingleShow;

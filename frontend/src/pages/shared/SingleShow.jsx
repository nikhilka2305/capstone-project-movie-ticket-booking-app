import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Card from "../../components/shared/Card";
import Button from "../../components/shared/formcomponents/Button";
import { useEffect, useState } from "react";

import { SeatSelection } from "./SeatGrid";

import toast from "react-hot-toast";
import AverageRating from "../../components/shared/formcomponents/AverageRating";

import { dayJSUTCtoIST } from "../../utils/dateFormatter";
import Skeleton from "../../components/shared/Skeleton";

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
		rows: "",
		columns: "",
		bookedSeats: [],
		seatClasses: [], // Sample booked seats
	});
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	const { showid } = useParams();
	const tagsClasses =
		"text-sm text-gray-600 rounded bg-blue-gray-50 inline pl-2 p-1 text-center";

	useEffect(() => {
		const serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}/show/${showid}`;
		setLoading(true);
		async function getShow() {
			try {
				const response = await axios.get(`${serverUrl}`);
				const responseData = response.data;

				const showTimeIST = dayJSUTCtoIST(responseData.showTime);

				responseData.showTime = showTimeIST;

				setShow(responseData);
				const theaterData = responseData.theater;

				setTheaterSeats({
					rows: theaterData.seats.rows,
					columns: theaterData.seats.seatsPerRow,
					bookedSeats: responseData.bookedSeats.map(
						(seat) => `${seat.seatNumber.row}-${seat.seatNumber.col}`
					),
					seatClasses: theaterData.seatClasses,
				});

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

				setMovieRating({
					averageRating: movieReviewResponse.data.averageRating,
					reviewCount: movieReviewResponse.data.reviewCount,
				});
				setTheaterRating({
					averageRating: theaterReviewResponse.data.averageRating,
					reviewCount: theaterReviewResponse.data.reviewCount,
				});
			} catch (err) {
				toast.error("Unable to fetch show data");
				// navigate("/theaters");
			}
		}
		setLoading(false);
		getShow();
	}, [showid, navigate]);

	return (
		<>
			{loading && <Skeleton />}
			{!loading && show && (
				<>
					<Card
						loading={loading}
						title={show.movie.movieName}
						subtitle={`Show Date & Time: ${show.showTime} Theater: ${show.theater.theaterName}`}
						image={show.movie.posterImage}
						btndisabled={new Date(show.showTime).getTime() < Date.now()}
						onClick={() => navigate("addbooking")}
					>
						<div>
							<div className="tags flex justify-start gap-2 mb-4">
								<p className={tagsClasses}>{show.movie.genre}</p>
								<p className={tagsClasses}>{show.movie.language}</p>
								<p className={tagsClasses}>{show.movie.movieduration} mins</p>
								<p className={tagsClasses}>
									{new Date(show.movie.releaseDate).toLocaleDateString("en-IN")}
								</p>
								<p className={tagsClasses}>
									Rating: <span className="font-bold">{show.movie.rating}</span>
								</p>
							</div>
							<p className="text-lg mt-2 leading-relaxed dark:text-slate-50">
								{show.movie.movieDescription}
							</p>
							<ul className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed flex gap-4 pt-4 flex-wrap">
								{" "}
								{show.movie.movieCast.map((cast, i) => (
									<li
										key={i}
										className="bg-gray-200 dark:bg-gray-700 py-1 px-2 rounded-md"
									>
										{cast}
									</li>
								))}
							</ul>
							<div className="mt-4 text-lg dark:text-slate-50">
								<span className="font-bold">Directed By: </span>{" "}
								{show.movie.director}
							</div>
						</div>
						<h3 className="mt-4 text-lg font-semibold dark:text-slate-50">
							Movie Rating
						</h3>
						<div className="flex items-center mt-2">
							<div className=" text-lg flex gap-2">
								<span className="dark:text-slate-50">Rating:</span>
								<span className="">
									{movieRating.averageRating > 0 ? (
										<AverageRating rating={movieRating.averageRating} />
									) : (
										"No Rating"
									)}
								</span>
							</div>
							<div className=" ml-2 text-sm dark:text-slate-50">
								{movieRating.reviewCount > 0
									? `${movieRating.reviewCount} reviews`
									: "No Reviews"}
							</div>
						</div>
						<h3 className="mt-4 text-lg font-semibold dark:text-slate-50">
							Theater Rating
						</h3>
						<div className="flex items-center mt-2">
							<div className=" text-lg flex gap-2">
								<span className="dark:text-slate-50">Rating:</span>
								<span>
									{theaterRating.averageRating > 0 ? (
										<AverageRating rating={theaterRating.averageRating} />
									) : (
										"No Rating"
									)}
								</span>
							</div>
							<div className=" ml-2 text-sm dark:text-slate-50">
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
						<SeatSelection theaterSeats={theaterSeats} displayOnly={true} />
					</div>
				</>
			)}
		</>
	);
}

export default SingleShow;

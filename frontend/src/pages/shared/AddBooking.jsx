import React from "react";
import { useContext, useEffect, useState } from "react";

import Button from "../../components/shared/formcomponents/Button";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import Card from "../../components/shared/Card";
import { SeatSelection } from "./SeatGrid";
import { formatDate } from "../../utils/dateFormatter";
import { formatSeatNumber } from "../../utils/numbertoLetterID";

// Stripe

import { loadStripe } from "@stripe/stripe-js";
import Skeleton from "../../components/shared/Skeleton";

function AddBooking() {
	const navigate = useNavigate();

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
		selectedSeats: [],
		seatClasses: [], // Sample booked seats
	});
	const [selectedSeats, setSelectedSeats] = useState([]);
	const [inValidShow, setInValidShow] = useState(false);
	const [loading, setLoading] = useState(true);
	const { showid } = useParams();
	const tagsClasses =
		"text-sm text-gray-500 rounded bg-blue-gray-50 inline pl-2 p-1 text-center";

	useEffect(() => {
		const serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}/show/${showid}`;
		setLoading(true);
		async function getShow() {
			try {
				const response = await axios.get(`${serverUrl}`);
				const responseData = response.data;

				setShow(responseData);

				if (new Date(responseData.showTime) < Date.now()) {
					setInValidShow(true);
				}
				const theaterData = responseData.theater;

				setTheaterSeats({
					rows: theaterData.seats.rows,
					columns: theaterData.seats.seatsPerRow,
					bookedSeats: responseData.bookedSeats.map(
						(seat) => `${seat.seatNumber.row}-${seat.seatNumber.col}`
					),
					selectedSeats: selectedSeats,
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
				navigate("/theaters");
			}
		}
		setLoading(false);
		getShow();
	}, [showid, navigate, selectedSeats]);

	const handleAddBooking = async function (evt) {
		const stripe = await loadStripe(
			import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
		);
		const selectedSeatInfo = selectedSeats.map((seat) => {
			const [row, col] = seat.seatNumber.split("-");
			return {
				seatNumber: {
					row: row,
					col: col,
				},
				seatClass: {
					className: seat.className,
					price: seat.price,
				},
			};
		});

		const displaySeatInfo = selectedSeats.map((seat) => {
			return {
				image: show.movie.posterImage,
				seatNumber: formatSeatNumber(seat.seatNumber),
				seatClass: {
					className: seat.className,
					price: seat.price,
				},
			};
		});

		const bookingInfo = {
			showInfo: show._id,
			seats: selectedSeatInfo,
		};
		const serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}`;
		evt.preventDefault();
		let loadingToast = toast.loading("Confirming Booking.. Making Payment");

		try {
			let session = await axios.post(
				`${serverUrl}/payments/create-checkout-session`,
				{
					bookingData: {
						displaySeatInfo,
						bookingInfo,
						price: selectedSeats.reduce((total, seat) => total + seat.price, 0),
					},
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			const result = stripe.redirectToCheckout({
				sessionId: session.data.sessionId,
			});

			toast.dismiss(loadingToast);
			toast.success("Payment Initiated");
		} catch (err) {
			toast.dismiss(loadingToast);
			toast.error("Unable to Initiate Payment Booking");
		}
	};

	return (
		<>
			{loading && <Skeleton />}
			{!loading && show && (
				<>
					<Card
						loading={loading}
						title={show.movie.movieName}
						subtitle={`Show Date & Time: ${new Date(
							show.showTime
						).toLocaleString("en-IN", {
							timeZone: "Asia/Kolkata",
						})} Theater: ${show.theater.theaterName}`}
						image={show.movie.posterImage}
						onClick={() => navigate("/shows")}
						btnLabel="Browse Other Shows"
					>
						<div>
							<div className="tags flex justify-start gap-2">
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
							<p className="text-lg  mt-2 leading-relaxed">
								{show.movie.movieDescription}
							</p>
							<ul className="text-gray-600 text-sm  mt-2 leading-relaxed flex gap-4 pt-4 flex-wrap">
								{" "}
								{show.movie.movieCast.map((cast, i) => (
									<li key={i} className="bg-gray-200 py-1 px-2 rounded-md">
										{cast}
									</li>
								))}
							</ul>
							<div className="mt-4 text-lg ">
								<span className=" font-bold">Directed By: </span>{" "}
								{show.movie.director}
							</div>
						</div>
						<h3>Movie Rating</h3>
						<div className="flex items-center">
							<div className=" text-lg md:text-lg mt-1 flex gap-2">
								<span>Rating:</span>
								<span className="">
									{movieRating.averageRating > 0
										? `${movieRating.averageRating} / 5`
										: "No Rating"}
								</span>
							</div>
							<div className=" ml-2 text-sm md:text-base mt-1">
								{movieRating.reviewCount > 0
									? `${movieRating.reviewCount} reviews`
									: "No Reviews"}
							</div>
						</div>
						<h3>Theater Rating</h3>
						<div className="flex items-center">
							<div className=" text-lg md:text-lg mt-1 flex gap-2">
								<span>Rating:</span>
								<span className="">
									{theaterRating.averageRating > 0
										? `${theaterRating.averageRating} / 5`
										: "No Rating"}
								</span>
							</div>
							<div className=" ml-2 text-sm md:text-base mt-1">
								{theaterRating.reviewCount > 0
									? `${theaterRating.reviewCount} reviews`
									: "No Reviews"}
							</div>
						</div>
					</Card>

					<div className="card bg-base-100 w-full shadow-xl mx-auto">
						<div className=" flex justify-between items-center">
							<h2 className="text-3xl font-semibold mx-auto">
								Seat Availablity
							</h2>
							{inValidShow && <h3 className="text-red-500">Show Time Over</h3>}
							<Button
								label="Proceed to Booking"
								disabled={selectedSeats.length === 0 || inValidShow}
								onClick={() =>
									document.getElementById("my_modal_3").showModal()
								}
							/>
						</div>
						<dialog id="my_modal_3" className="modal">
							<div className="modal-box flex flex-col gap-4">
								<form method="dialog">
									<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
										✕
									</button>
								</form>

								<h3 className="text-center text-2xl font-bold mb-4">
									Confirm The Details
								</h3>
								<p className="text-xl mb-4">Seats: </p>
								<ul className="">
									{selectedSeats.map((seat) => {
										return (
											<li key={seat.seatNumber} className="text-center mb-2">
												{`${formatSeatNumber(seat.seatNumber)} - ${
													seat.className
												} (₹${seat.price}) `}
											</li>
										);
									})}
								</ul>
								<p className="mt-8 text-2xl">
									<strong className="font-semibold text-xl mr-16">
										Total Price:
									</strong>{" "}
									₹
									{selectedSeats.reduce((total, seat) => total + seat.price, 0)}
								</p>

								<Button
									colorClass="bg-green-500 text-white"
									label="Complete Booking"
									onClick={handleAddBooking}
								/>
							</div>
						</dialog>
						<SeatSelection
							theaterSeats={theaterSeats}
							displayOnly={inValidShow}
							selectedSeats={selectedSeats}
							setSelectedSeats={setSelectedSeats}
						/>
					</div>
				</>
			)}
		</>
	);
}

export default AddBooking;

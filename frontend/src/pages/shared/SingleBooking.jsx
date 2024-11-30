import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Card from "../../components/shared/Card";
import { formatDate } from "../../utils/dateFormatter";
import { formatSeatNumber } from "../../utils/numbertoLetterID";
import toast from "react-hot-toast";
import Button from "../../components/shared/formcomponents/Button";

function SingleBooking() {
	const [booking, setBooking] = useState();
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const { bookingid } = useParams();

	const tagsClasses =
		"text-sm text-gray-500 rounded bg-blue-gray-50 inline pl-2 p-1 text-center";
	useEffect(() => {
		const serverUrl = `${
			import.meta.env.VITE_SERVER_BASE_URL
		}/booking/${bookingid}`;
		setLoading(true);
		async function getBooking() {
			try {
				const response = await axios.get(`${serverUrl}`);
				const responseData = response.data;

				setBooking(responseData);
			} catch (err) {
				navigate("/theaters");
			}
		}
		setLoading(false);
		getBooking();
	}, [bookingid, navigate]);

	const handleCancelBooking = async (evt) => {
		setLoading(true);
		let loadingToast = toast.loading("Cancelling Booking..");
		const serverUrl = `${
			import.meta.env.VITE_SERVER_BASE_URL
		}/booking/${bookingid}`;
		try {
			const response = await axios.delete(`${serverUrl}`);
			const responseData = response.data;

			toast.dismiss(loadingToast);
			toast.success("Booking Cancelled");
			navigate("/");
		} catch (err) {
			toast.dismiss(loadingToast);
			toast.error("Unable to Cancel Booking");
		}
		setLoading(false);
	};

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
			{!loading && booking && (
				<Card
					loading={loading}
					title={booking.bookingId}
					image={booking.showInfo.movie.posterImage}
					btnLabel="Cancel Booking"
					btndisabled={
						booking.status === "Cancelled" ||
						new Date(booking.showInfo.showTimeIST) < Date.now()
					}
					onClick={() => document.getElementById("my_modal_3").showModal()}
				>
					<div>
						<div className="tags flex flex justify-start gap-2">
							<p className={tagsClasses}>
								{formatDate(new Date(booking.showInfo.showTimeIST))} -{" "}
								{new Date(booking.showInfo.showTimeIST) < Date.now()
									? "Show Over"
									: "Upcoming"}
							</p>
							<p className={tagsClasses}>
								{booking.showInfo.theater.theaterName}
							</p>
							<p className={tagsClasses}>{booking.showInfo.theater.location}</p>
						</div>
						<div className="flex flex-col gap-4 mt-4 items-start">
							<h2 className="text-2xl">{booking.showInfo.movie.movieName}</h2>

							<p className="text-lg">
								Booking Status:{" "}
								<span className="text-sm">{booking.status}</span>
							</p>
							<p className="text-lg">
								Booking Cost:{" "}
								<span className="text-sm">{`₹${booking.BookingAmount}/-`}</span>
							</p>
							<div className="flex gap-2 items-center">
								<p className="text-lg">Seats: </p>
								<ul className="flex gap-2">
									{booking.seats.map((seat, i) => (
										<li key={i} className="text-sm">
											{formatSeatNumber(
												`${seat.seatNumber.row}-${seat.seatNumber.col} : ${seat.seatClass.className},`
											)}
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
					<dialog id="my_modal_3" className="modal">
						<div className="modal-box flex flex-col gap-4">
							<form method="dialog">
								<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
									✕
								</button>
							</form>

							<h3 className="text-center text-2xl font-bold mb-4">
								Are you sure about cancelling this booking?
							</h3>

							<Button
								colorClass="bg-red-500 text-white"
								label="Cancel Booking"
								onClick={handleCancelBooking}
							/>
						</div>
					</dialog>
				</Card>
			)}
		</>
	);
}

export default SingleBooking;

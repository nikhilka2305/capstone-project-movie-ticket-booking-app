import axios from "axios";
import { useContext, useEffect, useState } from "react";

import { Pagination } from "../../components/shared/Pagination";

import { Link, useParams } from "react-router-dom";
import { formatDate } from "../../utils/dateFormatter";
import { AuthContext } from "../../context/AuthContext";
import { formatSeatNumber } from "../../utils/numbertoLetterID";
import BookingCard from "../../components/shared/formcomponents/BookingCard";

function Bookings() {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1); // Current page
	const [totalPages, setTotalPages] = useState(1);
	const { user } = useContext(AuthContext);
	const userType = {
		User: "user",
		Admin: "admin",
		TheaterOwner: "theaterowner",
	};

	const urlPath = userType[user.role];

	const { userid, adminid, ownerid } = useParams();
	console.log(userid, adminid, ownerid);
	const urlid = userid || adminid || ownerid;

	useEffect(() => {
		setLoading(true);

		async function getBookings() {
			console.log(urlid);
			try {
				// if (user.role === "Admin" && user.loggedUserId !== userid) {
				// 	console.log("Checking by Admin");

				//     const userData = await axios.get()
				// }

				const serverUrl = `${
					import.meta.env.VITE_SERVER_BASE_URL
				}/${urlPath}/${urlid}/bookings`;
				const response = await axios.get(`${serverUrl}`, {
					params: { page, limit: 8 },
				});
				const responseData = response.data;
				console.log(responseData);
				const bookingsData = responseData.bookings;
				setBookings(bookingsData);
				setTotalPages(responseData.totalPages);
				setLoading(false);
			} catch (err) {
				console.log(err);
			}
		}
		getBookings();
	}, [page]);
	return (
		<main className="py-8 px-8 flex flex-col items-center  min-h-svh w-full">
			<h1 className="text-2xl mb-lg-2 my-4">Your Bookings</h1>
			{loading && <div>Loading...</div>}
			{bookings.map((item, i) => (
				<Link key={i} to={`./${item.bookingId}`}>
					<BookingCard
						image={item.showInfo.movie.posterImage}
						title={`Booking Id: ${item.bookingId}`}
					>
						<p>{item.showInfo.movie.movieName}</p>
						<p>{formatDate(new Date(item.showInfo.showTime))}</p>
						<p>{item.status}</p>
						<p>{`Booking Cost: ₹${item.BookingAmount}/-`}</p>
						<p>Seats: </p>
						<ul className="flex gap-2">
							{item.seats.map((seat, i) => (
								<li key={i}>
									{formatSeatNumber(
										`${seat.seatNumber.row}-${seat.seatNumber.col},`
									)}
								</li>
							))}
						</ul>
					</BookingCard>
				</Link>
			))}

			<Pagination page={page} setPage={setPage} totalPages={totalPages} />
		</main>
	);
}

export default Bookings;

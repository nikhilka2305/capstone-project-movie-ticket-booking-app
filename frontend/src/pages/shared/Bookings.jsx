import axios from "axios";
import { useContext, useEffect, useState } from "react";

import { Pagination } from "../../components/shared/Pagination";

import { Link, useParams } from "react-router-dom";
import { dayJSUTCtoIST } from "../../utils/dateFormatter";
import { AuthContext } from "../../context/AuthContext";
import { formatSeatNumber } from "../../utils/numbertoLetterID";
import BookingCard from "../../components/shared/formcomponents/BookingCard";
import toast from "react-hot-toast";
import Skeleton from "../../components/shared/Skeleton";
import GoBackLink from "../../components/shared/GoBackLink";

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
	let urlPath;

	const { userid, adminid, ownerid } = useParams();

	const urlid = userid || adminid || ownerid;
	if (user.role === "Admin") {
		if (userid) urlPath = "user";
		else if (adminid) urlPath = "admin";
		else if (ownerid) urlPath = "theaterowner";
	} else {
		urlPath = userType[user.role];
	}

	useEffect(() => {
		setLoading(true);

		async function getBookings() {
			try {
				const serverUrl = `${
					import.meta.env.VITE_SERVER_BASE_URL
				}/${urlPath}/${urlid}/bookings`;

				const response = await axios.get(`${serverUrl}`, {
					params: { page, limit: 8 },
				});
				const responseData = response.data;

				const bookingsData = responseData.bookings;
				setBookings(bookingsData);
				setTotalPages(responseData.totalPages);
				setLoading(false);
			} catch (err) {
				toast.error("Unable to fetch data");
			}
		}
		getBookings();
	}, [page]);
	return (
		<main className="py-8 px-8 flex flex-col items-center  min-h-svh w-full">
			<GoBackLink to=".." />
			<h1 className="text-2xl mb-lg-2 my-4">Bookings</h1>
			{loading && <Skeleton />}
			{!loading && (
				<>
					{bookings.length === 0 && (
						<h2 className="text-2xl text-center mt-8 mx-auto">No Bookings</h2>
					)}
					{bookings.map((item, i) => (
						<Link key={i} to={`./${item.bookingId}`}>
							<BookingCard
								image={item.showInfo.movie.posterImage}
								title={`Booking Id: ${item.bookingId}`}
							>
								<p>{item.showInfo.movie.movieName}</p>
								<p>{item.showInfo.theater.theaterName}</p>
								<p>{dayJSUTCtoIST(item.showInfo.showTime)}</p>
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
				</>
			)}
		</main>
	);
}

export default Bookings;

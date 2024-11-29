import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import PosterSlider from "../../components/shared/PosterSlider";
import Poster from "../../components/shared/Poster";

export function AdminDashboardComponent() {
	const { isAuthenticated, user } = useContext(AuthContext);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const { adminid } = useParams();
	const [bookingStats, setBookingStats] = useState({});

	useEffect(() => {
		if (adminid !== user.loggedUserId && user.role !== "Admin") {
			navigate(`./theaterowner/${user.loggedUserId}`);
		}
		setLoading(true);
		async function getPersonalBookingData() {
			try {
				const serverUrl = `${
					import.meta.env.VITE_SERVER_BASE_URL
				}/admin/${adminid}`;
				const response = await axios.get(`${serverUrl}/getbookingstats`);
				console.log(response);
				console.log(response.data[0]);
				setBookingStats(response.data[0]);
				const recentResponse = await axios.get(`${serverUrl}/bookings`, {
					params: { page: 1, limit: 4 },
				});
			} catch (err) {
				console.log(err);
			}
		}

		getPersonalBookingData();

		setLoading(false);
	}, [user, adminid, navigate]);

	return (
		<main className="py-8 px-8 flex flex-col items-center  min-h-svh w-full">
			<h1 className="text-center text-2xl my-8">Admin Dashboard</h1>
			{loading && <p>Loading...</p>}
			{!loading && (
				<>
					<h2>Bookings & Theaters </h2>
					<section className="flex flex-col gap-8 w-full justify-center items-center mx-4 md:flex-row md:mx-auto md:items-start my-8">
						<div className="border w-full md:w-1/3 rounded-md py-8 px-4 flex flex-col items-center ">
							<h2>Total Booking Details</h2>
						</div>
						<div className="border w-full md:w-1/3 rounded-md py-8 px-4 flex flex-col items-center ">
							<h2>Bookings Graph</h2>
						</div>
						<div className="border w-full md:w-1/3 rounded-md py-8 px-4 flex flex-col items-center ">
							<Link to={"../../theaters/managetheaters"}>
								<h2>Manage Theaters</h2>
							</Link>
							<Link to={"../../theaters/managetheaters/addtheater"}>
								Add Theater
							</Link>
						</div>
					</section>
					<h2>Movie Management </h2>
					<section className="flex flex-col gap-8 w-full justify-center items-center mx-4 md:flex-row md:mx-auto md:items-start my-8">
						<div className="border w-full md:w-1/3 rounded-md py-8 px-4 flex flex-col items-center ">
							<Link to={"../../movies/managemovies"}>
								<h2>Manage Movies</h2>
							</Link>
							<Link to={"../../movies/addmovie"}>
								<h2>Add Movie</h2>
							</Link>
						</div>
					</section>
					<h2>User & Theater Owner Management </h2>
					<section className="flex flex-col gap-8 w-full justify-center items-center mx-4 md:flex-row md:mx-auto md:items-start my-8">
						<div className="border w-full md:w-1/3 rounded-md py-8 px-4 flex flex-col items-center ">
							<Link to={"../manageusers"}>
								<h2>Manage Users</h2>
							</Link>
						</div>

						<div className="border w-full md:w-1/3 rounded-md py-8 px-4 flex flex-col items-center ">
							<Link to={"../managetheaterowners"}>
								<h2>Manage Theater Owners</h2>
							</Link>
						</div>
					</section>
					<h2>Personal Dashboard</h2>
					<section className="flex flex-col gap-8 w-full justify-center items-center mx-4 md:flex-row md:mx-auto md:items-start">
						<div className="userbookings border w-full md:w-1/3 rounded-md py-8 px-4 flex flex-col items-center min-h-60 ">
							<Link to="bookings">
								<h2 className="text-xl">View Personal Bookings</h2>
							</Link>
							<h3>Booking Stats</h3>
							<p>Total bookings: {bookingStats?.totalConfirmedBookings ?? 0}</p>
							<p>
								Cancelled bookings: {bookingStats?.totalCancelledBookings ?? 0}
							</p>
							<p>Total Spent: {bookingStats?.totalPrice ?? 0}</p>
						</div>
					</section>
				</>
			)}
		</main>
	);
}

import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import PosterSlider from "../../components/shared/PosterSlider";
import Poster from "../../components/shared/Poster";
import StatsComponent from "../../components/shared/StatsComponent";
import toast from "react-hot-toast";

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

				setBookingStats(response.data[0]);
				const recentResponse = await axios.get(`${serverUrl}/bookings`, {
					params: { page: 1, limit: 4 },
				});
			} catch (err) {
				toast.error("Couldn't fetch data");
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
						<div className="border w-full md:w-1/3 rounded-md py-8 px-4 flex flex-col gap-4 items-center ">
							<Link to={"../../theaters/managetheaters"}>
								<button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg w-52">
									Manage Theaters
								</button>
							</Link>
							<Link to={"addtheater"}>
								<button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg w-52">
									Add Theater
								</button>
							</Link>
						</div>
					</section>
					<h2>Movie Management </h2>
					<section className="flex flex-col gap-8 w-full justify-center items-center mx-4 md:flex-row md:mx-auto md:items-start my-8">
						<div className="border w-full md:w-1/3 rounded-md py-8 px-4 flex flex-col gap-4 items-center ">
							<Link to={"../../movies/managemovies"}>
								<button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg w-52">
									Manage Movies
								</button>
							</Link>
							<Link to={"../../movies/addmovie"}>
								<button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg w-52">
									Add Movie
								</button>
							</Link>
						</div>
					</section>
					<h2>User & Theater Owner Management </h2>
					<section className="flex flex-col gap-8 w-full justify-center items-center mx-4 md:flex-row md:mx-auto md:items-start my-8">
						<div className="border w-full md:w-1/3 rounded-md py-8 px-4 flex flex-col gap-4 items-center ">
							<Link to={"../manageusers"}>
								<button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg w-52">
									Manage Users
								</button>
							</Link>
						</div>

						<div className="border w-full md:w-1/3 rounded-md py-8 px-4 flex flex-col items-center ">
							<Link to={"../managetheaterowners"}>
								<button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg w-52">
									Manage Theater Owners
								</button>
							</Link>
						</div>
					</section>
					<h2>Personal Dashboard</h2>
					<section className="flex flex-col gap-8 w-full justify-center items-center mx-4 md:flex-row md:mx-auto md:items-start">
						<div className="userbookings border w-full  rounded-md py-8 px-4 flex flex-col gap-4 items-center min-h-60 ">
							<Link to="bookings">
								<button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg w-52">
									View Personal Bookings
								</button>
							</Link>
							<StatsComponent
								label1="Total Bookings"
								label2="Cancelled Bookings"
								label3="Total Spent"
								value1={bookingStats?.totalConfirmedBookings ?? 0}
								value2={bookingStats?.totalCancelledBookings ?? 0}
								value3={bookingStats?.totalPrice ?? 0}
							/>
						</div>
					</section>
				</>
			)}
		</main>
	);
}

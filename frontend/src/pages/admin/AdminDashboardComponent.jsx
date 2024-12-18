import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import PosterSlider from "../../components/shared/PosterSlider";
import Poster from "../../components/shared/Poster";
import StatsComponent from "../../components/shared/StatsComponent";
import toast from "react-hot-toast";
import BarChart from "../../components/shared/BarChart";
import LineChart from "../../components/shared/LineChart";
import PieChart from "../../components/shared/PieChart";
import Skeleton from "../../components/shared/Skeleton";

export function AdminDashboardComponent() {
	const { isAuthenticated, user } = useContext(AuthContext);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const { adminid } = useParams();
	const [bookingStats, setBookingStats] = useState({});
	const [movieBookingData, setMovieBookingData] = useState([]);
	const [theaterBookingData, setTheaterBookingData] = useState([]);
	const [monthlyData, setMonthlyData] = useState([]);
	const [theaterBookingStats, setTheaterBookingStats] = useState({});
	const [cancelledTheaterBookingStats, setCancelledTheaterBookingStats] =
		useState({});
	const [chartFilter, setChartFilter] = useState("bookings");
	const [shareFilter, setShareFilter] = useState("revenue");
	const [bookingRevenueShare, setBookingRevenueShare] = useState([]);

	function filterChange(filter) {
		setChartFilter(filter);
	}
	function shareFilterChange(filter) {
		setShareFilter(filter);
	}

	useEffect(() => {
		if (adminid !== user.loggedUserId && user.role !== "Admin") {
			navigate(`./theaterowner/${user.loggedUserId}`);
		}
		setLoading(true);
		const serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}`;
		async function getPersonalBookingData() {
			try {
				const response = await axios.get(
					`${serverUrl}/admin/${adminid}/getbookingstats`
				);

				setBookingStats(response.data[0]);
			} catch (err) {
				toast.error("Couldn't fetch personal booking data");
			}
		}

		getPersonalBookingData();
		async function getTotalBookingData() {
			try {
				const ownerTheaterStats = await axios.get(
					`${serverUrl}/admin/totalbookingstats`,
					{
						params: { status: "Confirmed" },
					}
				);

				setTheaterBookingStats(ownerTheaterStats.data);
				const ownerTheaterCancelledStats = await axios.get(
					`${serverUrl}/admin/totalbookingstats`,
					{
						params: { status: "Cancelled" },
					}
				);
				setCancelledTheaterBookingStats(ownerTheaterCancelledStats.data);
			} catch (err) {
				toast.error("Couldn't fetch total booking data");
			}
		}
		async function getBookingsByMovie() {
			try {
				const bookingMovies = await axios.get(
					`${serverUrl}/booking/getbookingsbymovie`
				);

				setMovieBookingData(bookingMovies.data);
			} catch (err) {
				toast.error("Couldn't fetch bookings chart data");
			}
		}
		async function getBookingsByTheaters() {
			try {
				const bookingTheaters = await axios.get(
					`${serverUrl}/booking/getbookingsbytheaters`
				);

				setTheaterBookingData(bookingTheaters.data);
			} catch (err) {
				toast.error("Couldn't fetch bookings chart data");
			}
		}
		async function getMonthlyData(filter = chartFilter) {
			try {
				const monthlydata = await axios.get(
					`${serverUrl}/booking/getmonthlydata`,
					{
						params: {
							filter: filter,
						},
					}
				);

				setMonthlyData(monthlydata.data);
			} catch (err) {
				toast.error("Couldn't fetch monthly chart data");
			}
		}
		async function getBookingRevenueShare(metric = shareFilter) {
			try {
				const sharedata = await axios.get(
					`${serverUrl}/booking/getbookingrevenueshare`,
					{
						params: {
							metric: metric,
						},
					}
				);

				setBookingRevenueShare(sharedata.data);
			} catch (err) {
				toast.error("Couldn't fetch share chart data");
			}
		}
		getBookingRevenueShare();
		getTotalBookingData();
		getBookingsByMovie();
		getBookingsByTheaters();

		getMonthlyData(chartFilter);
		setLoading(false);
	}, [user, adminid, navigate, chartFilter, shareFilter]);

	return (
		<main className="py-8 px-8 flex flex-col items-center  min-h-svh w-full">
			<h1 className="text-center text-2xl my-8">Admin Dashboard</h1>
			{loading && <Skeleton />}
			{!loading && (
				<>
					<h2>Bookings & Theaters </h2>
					<section className="flex flex-col gap-8 w-full justify-center items-center mx-4 my-8">
						<div className="border w-full selection:rounded-md py-8 px-4 flex flex-col lg:flex-row items-start justify-center gap-12">
							<div className="min-h-[128px] max-h-fit">
								<BarChart
									data={movieBookingData}
									title="Movie Bookings"
									labelKey="movieName"
									valueKey="bookings"
								/>
							</div>
							<div className="min-h-[128px] max-h-fit">
								<BarChart
									data={theaterBookingData}
									title="Theater Bookings"
									labelKey="theaterName"
									valueKey="bookings"
								/>
							</div>
						</div>
						<div className="border min-h-[200px] w-full selection:rounded-md py-8 px-4 flex flex-col lg:flex-row items-start justify-center gap-8">
							<div className="min-h-[128px] max-h-fit">
								<LineChart
									data={monthlyData}
									filter={chartFilter}
									onFilterChange={filterChange}
								/>
							</div>
							<div className="min-h-[128px] max-h-fit">
								<PieChart
									data={bookingRevenueShare}
									filter={shareFilter}
									onFilterChange={shareFilterChange}
								/>
							</div>
						</div>

						<div className="border w-full  rounded-md py-8 px-4 flex flex-col items-center ">
							<StatsComponent
								label1="Total Bookings"
								label2="Total Revenue"
								label3="Cancelled Bookings"
								value1={theaterBookingStats?.totalBookings ?? 0}
								value2={`₹${theaterBookingStats?.totalBookingAmount ?? 0}`}
								value3={cancelledTheaterBookingStats?.totalBookings ?? 0}
							/>
							<Link to="theaterbookings" className="my-4">
								<button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg w-52">
									View Theater Bookings
								</button>
							</Link>
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

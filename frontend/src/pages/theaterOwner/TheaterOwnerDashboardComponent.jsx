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

export function TheaterOwnerDashboardComponent() {
	const { isAuthenticated, user } = useContext(AuthContext);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const { ownerid } = useParams();
	const [bookingStats, setBookingStats] = useState({});
	const [theaterBookingStats, setTheaterBookingStats] = useState({});
	const [cancelledTheaterBookingStats, setCancelledTheaterBookingStats] =
		useState({});
	const [theaterBookingData, setTheaterBookingData] = useState([]);
	const [chartFilter, setChartFilter] = useState("bookings");
	const [monthlyData, setMonthlyData] = useState([]);
	const [shareFilter, setShareFilter] = useState("revenue");
	const [bookingRevenueShare, setBookingRevenueShare] = useState([]);
	const [ownerInfo, setOwnerInfo] = useState({});
	function filterChange(filter) {
		setChartFilter(filter);
	}
	function shareFilterChange(filter) {
		setShareFilter(filter);
	}
	useEffect(() => {
		if (ownerid !== user.loggedUserId && user.role !== "Admin") {
			navigate(`./theaterowner/${user.loggedUserId}`);
		}
		const serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}`;
		setLoading(true);
		async function getOwnerData() {
			try {
				const serverUrl = `${
					import.meta.env.VITE_SERVER_BASE_URL
				}/theaterowner/${ownerid}`;
				const response = await axios.get(`${serverUrl}/profile`);
				setOwnerInfo(response.data);
			} catch (err) {
				toast.error("Unable to fetch user data");
			}
		}
		async function getPersonalBookingData() {
			try {
				const response = await axios.get(
					`${serverUrl}/theaterowner/${ownerid}/getbookingstats`
				);

				setBookingStats(response.data[0]);
			} catch (err) {
				toast.error("Unable to fetch owner booking data");
			}
		}

		async function getTotalBookingData() {
			const ownerTheaterStats = await axios.get(
				`${serverUrl}/theaterowner/${ownerid}/totalbookingstats`,
				{
					params: { status: "Confirmed" },
				}
			);

			setTheaterBookingStats(ownerTheaterStats.data);
			const ownerTheaterCancelledStats = await axios.get(
				`${serverUrl}/theaterowner/${ownerid}/totalbookingstats`,
				{
					params: { status: "Cancelled" },
				}
			);
			setCancelledTheaterBookingStats(ownerTheaterCancelledStats.data);
		}
		async function getBookingsByTheaters() {
			try {
				const bookingTheaters = await axios.get(
					`${serverUrl}/theaterowner/${ownerid}/getbookingsbytheaters`
				);

				setTheaterBookingData(bookingTheaters.data);
			} catch (err) {
				toast.error("Couldn't fetch bookings chart data");
			}
		}
		async function getMonthlyData(filter = chartFilter) {
			try {
				const monthlydata = await axios.get(
					`${serverUrl}/theaterowner/${ownerid}/getmonthlydata`,
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
					`${serverUrl}/theaterowner/${ownerid}/getbookingrevenueshare`,
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
		getOwnerData();
		getBookingRevenueShare();
		getMonthlyData(chartFilter);
		getBookingsByTheaters();
		getPersonalBookingData();
		getTotalBookingData();
		setLoading(false);
	}, [user, ownerid, navigate, chartFilter]);

	return (
		<main className="py-8 px-8 flex flex-col items-center  min-h-svh w-full">
			{user.role === "Admin" && (
				<Link to={`/admin/managetheaterowners`}>Go Back</Link>
			)}
			<h1 className="text-center text-2xl my-8">
				{ownerInfo?.username} Theater Owner Dashboard
			</h1>
			{loading && (
				<div className="flex w-52 flex-col gap-4">
					<div className="skeleton h-32 w-full"></div>
					<div className="skeleton h-4 w-28"></div>
					<div className="skeleton h-4 w-full"></div>
					<div className="skeleton h-4 w-full"></div>
				</div>
			)}
			{!loading && (
				<>
					<section className="flex flex-col gap-8 w-full justify-center items-center mx-4 t my-8">
						<div className="border w-full  rounded-md py-8 px-4 flex flex-col items-center ">
							<div className="min-h-[128px] max-h-fit">
								<BarChart
									data={theaterBookingData}
									title="Theater Bookings"
									labelKey="theaterName"
									valueKey="bookings"
								/>
							</div>
						</div>
						<div className="border min-h-[200px] w-full selection:rounded-md py-8 px-4 flex flex-col lg:flex-row items-center justify-center gap-8">
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
						<div className="border w-full  rounded-md py-8 px-4 flex flex-col gap-4 items-center ">
							<Link to={"managetheaters"}>
								<button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg w-52">
									Manage Own Theaters
								</button>
							</Link>
							{user.role === "TheaterOwner" && (
								<Link to={"addtheater"}>
									<button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg w-52">
										Add Theater
									</button>
								</Link>
							)}
						</div>
					</section>
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

					{user.role === "TheaterOwner" && (
						<section className="flex flex-col gap-8 w-full justify-center items-center mx-4 md:flex-row md:mx-auto md:items-start my-8">
							<div className="border w-full rounded-md py-8 px-4 flex flex-col gap-4 items-center ">
								<Link to={"../../movies/addmovie"}>
									<button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg w-52">
										Add Movie
									</button>
								</Link>
							</div>
						</section>
					)}
					<section className="flex flex-col gap-8 w-full justify-center items-center mx-4 md:flex-row md:mx-auto md:items-start my-8">
						<div className="userbookings border w-full rounded-md py-8 px-4 flex flex-col gap-4 items-center min-h-60">
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

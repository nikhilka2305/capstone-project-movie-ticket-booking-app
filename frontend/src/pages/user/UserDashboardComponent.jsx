import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import PosterSlider from "../../components/shared/PosterSlider";
import Poster from "../../components/shared/Poster";
import StatsComponent from "../../components/shared/StatsComponent";
import StatSingleComponent from "../../components/shared/StatSingleComponent";
import toast from "react-hot-toast";

function UserDashboardComponent() {
	const { isAuthenticated, user } = useContext(AuthContext);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const { userid } = useParams();
	const [bookingStats, setBookingStats] = useState({});
	const [reviewStats, setReviewStats] = useState({});
	const [recentMovies, setRecentMovies] = useState([]);
	useEffect(() => {
		if (userid !== user.loggedUserId && user.role !== "Admin") {
			navigate(`./user/${user.loggedUserId}`);
		}
		setLoading(true);
		async function getBookingData() {
			try {
				const serverUrl = `${
					import.meta.env.VITE_SERVER_BASE_URL
				}/user/${userid}`;
				const response = await axios.get(`${serverUrl}/getbookingstats`);

				setBookingStats(response.data[0]);
				const recentResponse = await axios.get(`${serverUrl}/bookings`, {
					params: { page: 1, limit: 4 },
				});

				setRecentMovies(recentResponse.data.bookings);
			} catch (err) {
				toast.error("Unable to fetch user booking data");
			}
		}
		async function getReviewData() {
			try {
				const serverUrl = `${
					import.meta.env.VITE_SERVER_BASE_URL
				}/user/${userid}`;
				const response = await axios.get(`${serverUrl}/getreviewstats`);

				setReviewStats(response.data[0]);
			} catch (err) {
				toast.error("Unable to fetch user review data");
			}
		}
		getBookingData();
		getReviewData();
		setLoading(false);
	}, [user, userid, navigate]);

	return (
		<main className="py-8 px-8 flex flex-col items-center  min-h-svh w-full">
			<h1 className="text-center text-2xl my-8">User Dashboard</h1>
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
					<section className="flex flex-col gap-8 w-full justify-center items-center mx-4  md:mx-auto ">
						<div className="userbookings border w-full  rounded-md py-8 px-4 flex flex-col gap-4 items-center min-h-60 ">
							<Link to="bookings">
								<button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg w-52">
									View User Bookings
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
						<div className="userreviews border w-full rounded-md py-8 px-4 flex flex-col gap-4 items-center min-h-60 ">
							<Link to="reviews">
								<button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg w-52">
									View User Reviews
								</button>
							</Link>
							<StatsComponent
								label1="Total Reviews"
								label2="Total Movie Reviews"
								label3="Total Theater Reviews:"
								value1={reviewStats?.reviewCounts?.totalReviews ?? 0}
								value2={reviewStats?.reviewCounts?.movieReviews ?? 0}
								value3={reviewStats?.reviewCounts?.theaterReviews ?? 0}
							/>
							<StatSingleComponent
								label="Recent Movie Reviewed"
								value={reviewStats?.recentMovieReview?.movieDetails}
							/>
							<StatSingleComponent
								label="Recent Theater Reviewed"
								value={reviewStats?.recentTheaterReview?.theaterDetails}
							/>
						</div>
					</section>
					<aside className="mt-8">
						<h2>Recently Booked Movies</h2>
						<PosterSlider classes="">
							{recentMovies.map((item, i) => (
								<Link to={`/movies/${item.showInfo.movie.movieId}`} key={i}>
									<Poster
										url={item.showInfo.movie.posterImage}
										title={item.showInfo.movie.movieName}
										otherInfo={item.status}
									/>
								</Link>
							))}
						</PosterSlider>
					</aside>
				</>
			)}
		</main>
	);
}

export default UserDashboardComponent;

import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import PosterSlider from "../../components/shared/PosterSlider";
import Poster from "../../components/shared/Poster";

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
				console.log(response.data[0]);
				setBookingStats(response.data[0]);
				const recentResponse = await axios.get(`${serverUrl}/bookings`, {
					params: { page: 1, limit: 4 },
				});
				console.log("Recent");
				console.log(recentResponse);
				setRecentMovies(recentResponse.data.bookings);
			} catch (err) {
				console.log(err);
			}
		}
		async function getReviewData() {
			try {
				const serverUrl = `${
					import.meta.env.VITE_SERVER_BASE_URL
				}/user/${userid}`;
				const response = await axios.get(`${serverUrl}/getreviewstats`);
				console.log(response.data[0]);
				setReviewStats(response.data[0]);
			} catch (err) {
				console.log(err);
			}
		}
		getBookingData();
		getReviewData();
		setLoading(false);
	}, [user, userid, navigate]);

	return (
		<main className="py-8 px-8 flex flex-col items-center  min-h-svh w-full">
			<h1 className="text-center text-2xl my-8">User Dashboard</h1>
			{loading && <p>Loading...</p>}
			{!loading && (
				<>
					<section className="flex flex-col gap-8 w-full justify-center items-center mx-4 md:flex-row md:mx-auto md:items-start">
						<div className="userbookings border w-full md:w-1/3 rounded-md py-8 px-4 flex flex-col items-center ">
							<Link to="bookings">
								<h2 className="text-xl">View User Bookings</h2>
							</Link>
							<h3>Booking Stats</h3>
							<p>Total bookings: {bookingStats.totalConfirmedBookings}</p>
							<p>Cancelled bookings: {bookingStats.totalCancelledBookings}</p>
							<p>Total Spent: {bookingStats.totalPrice}</p>
						</div>
						<div className="userreviews border w-full md:w-1/3 rounded-md py-8 px-4 flex flex-col items-center">
							<Link to="reviews">
								<h2 className="text-xl">View User Reviews</h2>
							</Link>
							<h3>Review Stats</h3>
							<p>Total Reviews: {reviewStats?.reviewCounts?.totalReviews}</p>
							<p>
								Total Movie Reviews: {reviewStats?.reviewCounts?.movieReviews}
							</p>
							<p>
								Total Theater Reviews:{" "}
								{reviewStats?.reviewCounts?.theaterReviews}
							</p>
							{reviewStats?.recentMovieReview && (
								<p>
									{" "}
									Recent Movie Reviewed:{" "}
									{reviewStats?.recentMovieReview.movieDetails}
								</p>
							)}
							{reviewStats?.recentTheaterReview && (
								<p>
									{" "}
									Recent Theater Reviewed:{" "}
									{reviewStats?.recentTheaterReview.theaterDetails}
								</p>
							)}
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

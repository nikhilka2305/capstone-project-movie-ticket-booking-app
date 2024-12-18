import { useContext, useEffect, useState } from "react";

import { Pagination } from "../../components/shared/Pagination";

import { Link, useParams } from "react-router-dom";
import { formatDate } from "../../utils/dateFormatter";
import { AuthContext } from "../../context/AuthContext";
import { formatSeatNumber } from "../../utils/numbertoLetterID";
import BookingCard from "../../components/shared/formcomponents/BookingCard";
import axios from "axios";
import toast from "react-hot-toast";
import DisplayRating from "../../components/shared/formcomponents/DisplayRating";
import Skeleton from "../../components/shared/Skeleton";
import GoBackLink from "../../components/shared/GoBackLink";
// import { DisplayRating } from "../../components/shared/formcomponents/Rating";
// import AverageRating from "../../components/shared/formcomponents/AverageRating";

function Reviews() {
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1); // Current page
	const [totalPages, setTotalPages] = useState(1);
	const [reviews, setReviews] = useState([]);
	const { movieid, theaterid, userid } = useParams();
	const urlid = movieid || theaterid;
	const userurlid = userid;
	let urlPath;
	if (movieid) urlPath = "movie";
	else if (theaterid) urlPath = "theater";

	useState(() => {
		setLoading(true);
		async function getReviews() {
			try {
				let serverUrl;
				if (userurlid) {
					serverUrl = `${
						import.meta.env.VITE_SERVER_BASE_URL
					}/user/${userurlid}/reviews`;
				} else {
					serverUrl = `${
						import.meta.env.VITE_SERVER_BASE_URL
					}/${urlPath}/${urlid}/reviews`;
				}

				const response = await axios.get(`${serverUrl}`, {
					params: { page, limit: 8 },
				});

				const responseData = response.data;

				const reviewsData = responseData.reviews;

				setReviews(reviewsData);

				setTotalPages(responseData.totalPages);
				setLoading(false);
			} catch (err) {
				toast.error("Unable to fetch reviews");
			}
		}
		getReviews();
	}, [page]);

	return (
		<main className="py-8 px-8 flex flex-col items-center  min-h-svh w-full">
			<GoBackLink to=".." />
			<h1 className="text-2xl mb-lg-2 my-4">User Reviews</h1>
			{loading && <Skeleton />}
			{!loading && (
				<>
					{reviews.length === 0 && (
						<h2 className="text-2xl text-center mt-8 mx-auto">No Reviews</h2>
					)}
					{reviews.map((item, i) => (
						<Link key={i} to={`/managereviews/${item.reviewId}`}>
							<BookingCard
								image={
									item.userId.displayImage ||
									"https://t3.ftcdn.net/jpg/06/33/54/78/360_F_633547842_AugYzexTpMJ9z1YcpTKUBoqBF0CUCk10.jpg"
								}
								title={`Review For ${
									item.movieId?.movieName || item.theaterId?.theaterName
								}`}
							>
								{/* <p>{item.showInfo.movie.movieName}</p> */}
								<p>{formatDate(new Date(item.createdAt))}</p>
								<div className="flex items-center">
									<p>Rating:</p>
									<DisplayRating
										rating={item.userRating}
										ratingSize="rating-sm"
										reviewId={item.reviewId}
									/>
								</div>
								<p>UserReview: </p>
								<p>{item.userReview}</p>
								<p>Review by: {item.userId.username}</p>
								<p>Review For: {item.reviewFor}</p>
							</BookingCard>
						</Link>
					))}

					<Pagination page={page} setPage={setPage} totalPages={totalPages} />
				</>
			)}
		</main>
	);
}

export default Reviews;

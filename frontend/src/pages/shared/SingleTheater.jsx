import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Card from "../../components/shared/Card";
import Button from "../../components/shared/formcomponents/Button";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import AverageRating from "../../components/shared/formcomponents/AverageRating";

function SingleTheater() {
	const { user } = useContext(AuthContext);
	const [theater, setTheater] = useState();
	const [theaterRating, setTheaterRating] = useState({
		averageRating: 0,
		reviewCount: 0,
	});
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const { theaterid } = useParams();
	const tagsClasses =
		"text-sm rounded text-gray-600 bg-blue-gray-50 inline pl-2 p-1 text-center";

	useEffect(() => {
		const serverUrl = `${
			import.meta.env.VITE_SERVER_BASE_URL
		}/theater/${theaterid}`;
		setLoading(true);
		async function getTheater() {
			try {
				const response = await axios.get(`${serverUrl}`);
				const responseData = response.data;

				const reviewResponse = await axios.get(`${serverUrl}/avgrating`);

				setTheater(responseData);
				setTheaterRating({
					averageRating: reviewResponse.data.averageRating,
					reviewCount: reviewResponse.data.reviewCount,
				});
			} catch (err) {
				navigate("/theaters");
			}
		}
		setLoading(false);
		getTheater();
	}, [theaterid, navigate]);

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
			{!loading && theater && (
				<Card
					loading={loading}
					title={theater.theaterName}
					image={theater.images[0]}
					onClick={() => navigate("shows")}
					btnLabel="Browse Shows"
				>
					<div>
						<div className="tags flex justify-start gap-2">
							<p className={tagsClasses}>{theater.location}</p>
							<p className={tagsClasses}>
								Total Seats: {theater.seats.rows * theater.seats.seatsPerRow}
							</p>
						</div>
						<p className="text-lg mt-4 leading-relaxed">
							<span className=" text-2xl">Theater Details & Amenities</span>
							<br />
							<span className=" mr-8 text-sm">Seats: </span>
							{theater.seats.rows * theater.seats.seatsPerRow}
							<br />
							<span className=" mr-8 text-sm">Parking:</span>{" "}
							{theater.amenities && theater.amenities.parking}
							<br />
							<span className=" mr-8 text-sm">Restrooms:</span>{" "}
							{theater.amenities && theater.amenities.restroom}
							<br />
							<span className=" mr-8 text-sm">Food Counters:</span>
							{theater.amenities && theater.amenities.foodCounters}
							<br />
						</p>
						<ul className="text-sm text-gray-600 mt-2 leading-relaxed flex gap-4 pt-4 flex-wrap">
							{" "}
							{theater.seatClasses &&
								theater.seatClasses.map((sClass, i) => (
									<li key={i} className="bg-gray-200 py-1 px-2 rounded-md">
										{sClass.className} - ₹{sClass.price}/-
									</li>
								))}
						</ul>
					</div>
					<div className="flex items-center">
						<div className=" text-lg md:text-lg mt-1 flex gap-2">
							<span>Rating:</span>
							<span>
								{theaterRating.averageRating > 0 ? (
									<AverageRating rating={theaterRating.averageRating} />
								) : (
									"No Rating"
								)}
							</span>
						</div>
						<div className="ml-2 text-sm md:text-base mt-1">
							{theaterRating.reviewCount > 0
								? `${theaterRating.reviewCount} reviews`
								: "No Reviews"}
						</div>
					</div>
					<div className="flex gap-8">
						{user.role === "User" && (
							<Link
								to={"reviews/addreview"}
								className="p-1 rounded-md border w-32 text-center"
							>
								Add review
							</Link>
						)}
						<Link
							to={"reviews"}
							className="p-1 rounded-md border w-32 text-center"
						>
							View reviews
						</Link>
					</div>
				</Card>
			)}
		</>
	);
}

export default SingleTheater;

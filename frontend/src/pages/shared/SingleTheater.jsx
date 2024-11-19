import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Card from "../../components/shared/Card";
import Button from "../../components/shared/formcomponents/Button";

function SingleTheater() {
	const [theater, setTheater] = useState();
	const [theaterRating, setTheaterRating] = useState({
		averageRating: 0,
		reviewCount: 0,
	});
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const { theaterid } = useParams();
	console.log(theaterid);
	useEffect(() => {
		const serverUrl = `${
			import.meta.env.VITE_SERVER_BASE_URL
		}/theater/${theaterid}`;
		setLoading(true);
		async function getTheater() {
			try {
				const response = await axios.get(`${serverUrl}`);
				const responseData = response.data;
				console.log(responseData);
				const reviewResponse = await axios.get(`${serverUrl}/avgrating`);
				console.log(reviewResponse.data);
				setTheater(responseData);
				setTheaterRating({
					averageRating: reviewResponse.data.averageRating,
					reviewCount: reviewResponse.data.reviewCount,
				});
			} catch (err) {
				console.log(err);
				navigate("/theaters");
			}
		}
		setLoading(false);
		getTheater();
	}, [theaterid, navigate]);

	return (
		<>
			{loading && <div>Loading...</div>}
			{!loading && theater && (
				<Card loading={loading}>
					<img
						className="w-full max-h-[500px] object-cover md:w-2/5"
						src={
							theater.images
								? theater.images[0]
								: "https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg"
						}
						alt={theater.theaterName}
					/>
					<div className="">
						<div className="p-5 pb-10">
							<h1 className="text-3xl font-semibold text-gray-800 mt-4">
								{theater.theaterName}
							</h1>
							<p className="text-sm text-gray-500 rounded bg-blue-gray-50 inline p-1">
								{theater.location}
							</p>

							<p className="text-lg text-gray-600 mt-2 leading-relaxed">
								<span className="text-black text-2xl">Amenities</span>
								<br />
								<span className="text-gray-800 mr-8 text-sm">Seats: </span>
								{theater.seats.rows * theater.seats.seatsPerRow}
								<span className="text-gray-800 ml-4 mr-8 text-sm">
									Parking:
								</span>{" "}
								{theater.amenities && theater.amenities.parking}
								<span className="text-gray-800 ml-4 mr-8 text-sm">
									Restrooms:
								</span>{" "}
								{theater.amenities && theater.amenities.restroom}
								<span className="text-gray-800 ml-4 mr-8 text-sm">
									Food Counters:
								</span>
								{theater.amenities && theater.amenities.foodCounters}
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
						<div className="bg-blue-50 p-5 ">
							<div className="sm:flex sm:justify-between">
								<div>
									<div className="flex items-center">
										<div className="text-gray-900 ml-2 text-lg md:text-lg mt-1 flex gap-2">
											<span>Rating:</span>
											<span className="text-blue-gray-800">
												{theaterRating.averageRating > 0
													? `${theaterRating.averageRating} / 5`
													: "No Rating"}
											</span>
										</div>
										<div className="text-gray-600 ml-2 text-sm md:text-base mt-1">
											{theaterRating.reviewCount > 0
												? `${theaterRating.reviewCount} reviews`
												: "No Reviews"}
										</div>
									</div>
								</div>
								<Button label="See Shows" />
							</div>
						</div>
					</div>
				</Card>
			)}
		</>
	);
}

export default SingleTheater;

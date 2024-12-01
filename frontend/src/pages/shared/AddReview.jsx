import { useContext, useEffect, useState } from "react";
import Input from "../../components/shared/formcomponents/Input";
import Button from "../../components/shared/formcomponents/Button";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Select from "../../components/shared/formcomponents/Select";
import Card from "../../components/shared/Card";
import Poster from "../../components/shared/Poster";
import Rating from "../../components/shared/formcomponents/Rating";

function AddReview() {
	const [review, setReview] = useState({});
	const {
		watch,
		setValue,
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();
	const userRating = watch("userRating", 0);
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);
	useEffect(() => {
		setValue("userRating", 3);
	}, [setValue]);
	const [reviewFor, setReviewFor] = useState({
		image: "",
		name: "",
	});

	const { movieid, theaterid } = useParams();
	const urlid = movieid || theaterid;
	let urlPath;
	if (movieid) urlPath = "movie";
	else if (theaterid) urlPath = "theater";

	useEffect(() => {
		async function getReviewForData() {
			setLoading(true);
			try {
				const serverUrl = `${
					import.meta.env.VITE_SERVER_BASE_URL
				}/${urlPath}/${urlid}`;

				const reviewForData = await axios.get(`${serverUrl}`);

				const reviewFor = {
					image: reviewForData.data.posterImage
						? reviewForData.data.posterImage
						: reviewForData.data.images[0],
					name: reviewForData.data.movieName
						? reviewForData.data.movieName
						: reviewForData.data.theaterName,
				};

				setReviewFor(reviewFor);
			} catch (err) {
				toast.error("Unable to fetch data");
			}
		}
		getReviewForData();
		setLoading(false);
	}, [urlid, urlPath]);

	const handleAddReview = async (data, evt) => {
		evt.preventDefault();

		let loadingToast = toast.loading("Adding Review....");
		const serverUrl = `${
			import.meta.env.VITE_SERVER_BASE_URL
		}/${urlPath}/${urlid}/addreview`;
		const review = { ...data };

		try {
			const addReview = await axios.post(serverUrl, review, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			toast.dismiss(loadingToast);
			toast.success("Successfully Added Review");
			navigate("/login");
		} catch (err) {
			toast.dismiss(loadingToast);
			toast.error(
				err.response.data.error
					? err.response.data.error
					: "Unable to Add Review"
			);
		}
	};

	const [loading, setLoading] = useState(true);
	return (
		<section className="mx-auto my-8 w-full md:w-4/5 flex flex-col gap-8  items-center">
			<h2 className="text-center">Add Review</h2>
			{loading && <p>Loading</p>}
			{!loading && (
				<>
					<div className="card bg-base-100 w-full max-w-lg shadow-xl">
						<figure>
							<img
								src={`${reviewFor?.image}`}
								alt=""
								className="object-contain w-full h-96"
							/>
						</figure>
						<div className="card-body">{`${reviewFor.name}`}</div>
					</div>
					<form
						action=""
						className="border rounded-md border-slate-900 py-8 bg-slate-200 dark:bg-slate-700 flex flex-col gap-4 w-full"
						onSubmit={handleSubmit(handleAddReview)}
						noValidate
					>
						<Rating
							label="Choose Rating"
							name="userRating"
							value={userRating}
							onChange={(value) => setValue("userRating", value)}
							ref={register("userRating").ref}
						/>
						<Input
							label="Add User review"
							name="userReview"
							id="userReview"
							type="text-area"
							register={register}
							validationSchema={{
								required: "Review required",
							}}
							errors={errors}
						/>

						<div className="button-group flex gap-4 justify-center">
							<Button type="submit" label="Submit" />
							<Button
								label="Reset"
								onClick={() => {
									reset();
								}}
							/>
						</div>
					</form>
				</>
			)}
		</section>
	);
}

export default AddReview;

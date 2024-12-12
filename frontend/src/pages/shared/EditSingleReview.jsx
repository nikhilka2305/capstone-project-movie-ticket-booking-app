import { useContext, useEffect, useState } from "react";
import Input from "../../components/shared/formcomponents/Input";
import Button from "../../components/shared/formcomponents/Button";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "../../components/shared/formcomponents/Select";
import Rating from "../../components/shared/formcomponents/Rating";
import Skeleton from "../../components/shared/Skeleton";

function EditSingleReview() {
	const [editReview, setEditReview] = useState({});
	const {
		control,
		register,
		watch,
		setValue,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			userRating: editReview.userRating || "", // Provide default empty values
			userReview: editReview.userReview || "",
		},
	});
	const userRating = watch("userRating", 0);
	useEffect(() => {
		setValue("userRating", editReview?.userRating || 0);
	}, [setValue, editReview?.userRating]);

	const navigate = useNavigate();
	const { user } = useContext(AuthContext);

	const [loading, setLoading] = useState(true);
	const { reviewid } = useParams();
	const params = {
		User: "user",
		TheaterOwner: "theaterowner",
		Admin: "admin",
	};

	useEffect(() => {
		setLoading(true);

		async function fetchData() {
			const serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}`;
			try {
				const reviewData = await axios.get(`${serverUrl}/review/${reviewid}`);
				const review = reviewData.data;

				if (
					user.role !== "Admin" &&
					user.loggedUserObjectId !== review.userId.toString()
				) {
					navigate("/movies");
				}
				setEditReview(review);
				reset({
					userRating: review.userRating || "",
					userReview: review.userReview || "",
				});
				setLoading(false);
			} catch (err) {
				navigate("/movies");
				setLoading(false);
			}
		}
		fetchData();
	}, [reviewid, reset, user, navigate]);

	const handleUpdateReview = async function (data, evt) {
		evt.preventDefault();

		let loadingToast = toast.loading("Updating Review....");
		try {
			const serverUrl = `${
				import.meta.env.VITE_SERVER_BASE_URL
			}/review/${reviewid}`;
			const updatedReview = { ...data };

			const reviewUpdated = await axios.patch(serverUrl, updatedReview, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			toast.dismiss(loadingToast);
			toast.success("Successfully Updated Review");
			navigate(`/`);
		} catch (err) {
			toast.dismiss(loadingToast);
			toast.error("Unable to update review");
		}
	};
	const handleDeleteReview = async function () {
		let loadingToast = toast.loading("Deleting Review....");
		try {
			const serverUrl = `${
				import.meta.env.VITE_SERVER_BASE_URL
			}/review/${reviewid}`;

			const reviewDeleted = await axios.delete(serverUrl);

			toast.dismiss(loadingToast);
			toast.success("Successfully Deleted Review");
			navigate(`/`);
		} catch (err) {
			toast.dismiss(loadingToast);
			toast.error("Unable to delete review");
		}
	};
	return (
		<section className="mx-auto my-8 w-full lg:w-2/3 flex flex-col gap-8 ">
			<Link
				to={`/${params[user.role]}/${user.loggedUserId}`}
				className="text-center"
			>
				Go Back to Dashboard
			</Link>
			<h2 className="text-center">Update Review</h2>
			{loading && <Skeleton />}
			{!loading && (
				<>
					<form
						action=""
						className="border rounded-md border-slate-900 py-8 bg-slate-200 dark:bg-slate-700 flex flex-col gap-4"
						onSubmit={handleSubmit(handleUpdateReview)}
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
							label="Update User review"
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
					<dialog id="delete_review" className="modal">
						<div className="modal-box flex flex-col gap-4">
							<form method="dialog">
								<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
									✕
								</button>
							</form>

							<h3 className="text-center text-2xl font-bold mb-4">
								Are you sure about Deleting this review?
							</h3>

							<Button
								colorClass="bg-red-500 text-white"
								label="Delete Movie"
								onClick={handleDeleteReview}
							/>
						</div>
					</dialog>
					<div className="button-group flex gap-4 justify-center">
						<Button
							label="Delete this Review"
							colorClass="bg-red-500 text-white"
							disabled={editReview.deleted}
							onClick={() =>
								document.getElementById("delete_review").showModal()
							}
						/>
					</div>
				</>
			)}
		</section>
	);
}

export default EditSingleReview;

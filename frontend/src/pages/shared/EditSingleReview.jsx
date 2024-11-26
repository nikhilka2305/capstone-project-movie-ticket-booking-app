import { useContext, useEffect, useState } from "react";
import Input from "../../components/shared/formcomponents/Input";
import Button from "../../components/shared/formcomponents/Button";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Select from "../../components/shared/formcomponents/Select";

function EditSingleReview() {
	const [editReview, setEditReview] = useState({});
	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			userRating: editReview.userRating || "", // Provide default empty values
			userReview: editReview.userReview || "",
		},
	});
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);

	const [loading, setLoading] = useState(true);
	const { reviewid } = useParams();
	console.log(reviewid);

	useEffect(() => {
		setLoading(true);
		console.log("use effect");
		async function fetchData() {
			const serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}`;
			try {
				const reviewData = await axios.get(`${serverUrl}/review/${reviewid}`);
				const review = reviewData.data;
				console.log(review);
				if (
					user.role !== "Admin" &&
					user.loggedUserObjectId !== review.userId.toString()
				) {
					console.log("logged User Id", user.loggedUserObjectId, review.userId);
					console.log("NOt owner");
					// throw new Error("Unable to show this review");
					navigate("/movies");
				} else console.log("Yes Ad...");
				setEditReview(review);
				reset({
					userRating: review.userRating || "",
					userReview: review.userReview || "",
				});
				setLoading(false);
			} catch (err) {
				console.log(err);
				navigate("/movies");
				setLoading(false);
			}
		}
		fetchData();
	}, [reviewid, reset, user]);

	const handleUpdateReview = async function (data, evt) {
		evt.preventDefault();
		let loadingToast = toast.loading("Updating Review....");
		try {
			const serverUrl = `${
				import.meta.env.VITE_SERVER_BASE_URL
			}/review/${reviewid}`;
			const updatedReview = { ...data };
			console.log(updatedReview);
			const reviewUpdated = await axios.patch(serverUrl, updatedReview, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			console.log(reviewUpdated);
			toast.dismiss(loadingToast);
			toast.success("Successfully Updated Review");
			navigate(`/movies/`);
		} catch (err) {
			console.log(err);
			toast.dismiss(loadingToast);
			toast.error("Unable to update review");
		}
	};
	return (
		<section className="mx-auto my-8 w-full lg:w-2/3 flex flex-col gap-8 ">
			<h2 className="text-center">Add New Show</h2>
			{loading && <p>Loading</p>}
			{!loading && (
				<form
					action=""
					className="border rounded-md border-slate-900 py-8 bg-slate-200 dark:bg-slate-700 flex flex-col gap-4"
					onSubmit={handleSubmit(handleUpdateReview)}
					noValidate
				>
					<Controller
						name="userRating"
						control={control}
						defaultValue={""}
						rules={{
							required: "Please select a rating",
						}}
						render={({ field }) => (
							<Select
								label="Choose a Rating"
								{...field}
								options={[1, 2, 3, 4, 5]}
								onChange={field.onChange}
								errors={errors}
							/>
						)}
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
						<Button
							type="submit"
							label="Submit"
							onClick={() => {
								console.log(errors);
							}}
						/>
						<Button
							label="Reset"
							onClick={() => {
								reset();
							}}
						/>
					</div>
				</form>
			)}
		</section>
	);
}

export default EditSingleReview;

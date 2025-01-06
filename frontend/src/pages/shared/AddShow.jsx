import { useContext, useEffect, useState } from "react";
import Input from "../../components/shared/formcomponents/Input";
import Button from "../../components/shared/formcomponents/Button";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "../../components/shared/formcomponents/Select";

import { dayJSISTtoUTC } from "../../utils/dateFormatter";
import Skeleton from "../../components/shared/Skeleton";
import GoBackLink from "../../components/shared/GoBackLink";

function AddShow() {
	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	const navigate = useNavigate();
	const { user } = useContext(AuthContext);
	const [theater, setTheater] = useState({});
	const [movies, setMovies] = useState([]);
	const [show, setShow] = useState({});
	const [loading, setLoading] = useState(true);
	const { theaterid } = useParams();

	useEffect(() => {
		setLoading(true);

		async function fetchData() {
			const serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}`;
			try {
				const theaterData = await axios.get(
					`${serverUrl}/theater/${theaterid}`
				);
				const theater = theaterData.data;

				if (
					user.role !== "Admin" &&
					user.loggedUserObjectId !== theater.owner.toString()
				) {
					navigate("/theaters");
				}
				setTheater(theater);
				const movieData = await axios.get(`${serverUrl}/movie`);
				const movies = movieData.data;

				setMovies(movies);
				setLoading(false);
			} catch (err) {
				toast.error("Unable to fetch details");
				setLoading(false);
			}
		}
		fetchData();
	}, [theaterid, navigate, user.loggedUserObjectId, user.role]);

	const handleAddShow = async function (data, evt) {
		evt.preventDefault();
		let loadingToast = toast.loading("Adding Show....");

		const serverUrl = `${
			import.meta.env.VITE_SERVER_BASE_URL
		}/theater/${theaterid}/newShow`;

		try {
			const show = { ...data };

			const showTimeUTC = dayJSISTtoUTC(show.showTime);

			show.showTime = showTimeUTC;

			const addShow = await axios.post(serverUrl, show, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			toast.dismiss(loadingToast);
			toast.success("Successfully Added Show");
			navigate("..");
		} catch (err) {
			let errorMessage = err.response.data.error;
			if (errorMessage === "Validation failed") {
				errorMessage =
					"Enter Correct Date & Time. It must be atleast one hour from now.";
			}
			toast.dismiss(loadingToast);

			toast.error(
				err?.response?.data?.error
					? "Unable to Add Show: " + errorMessage
					: "Unable to Add Show due to unknown error"
			);
		}
	};

	return (
		<section className="mx-auto my-8 w-full lg:w-2/3 flex flex-col gap-8 ">
			<h2 className="text-center">Add New Show</h2>

			<GoBackLink to=".." label="Go Back to Manage Theater" />
			{loading && <Skeleton />}
			{!loading && (
				<form
					action=""
					className="border rounded-md border-slate-900 py-8 bg-slate-200 dark:bg-slate-700 flex flex-col gap-4"
					onSubmit={handleSubmit(handleAddShow)}
					noValidate
				>
					<Controller
						name="movie"
						control={control}
						defaultValue={""}
						rules={{
							required: "Please select a movie",
						}}
						render={({ field }) => (
							<Select
								label="Choose a Movie"
								field="movie"
								options={movies}
								displayKey="movieName"
								valueKey="_id"
								defaultValue={""}
								onChange={field.onChange}
								errors={errors}
							/>
						)}
					/>
					<Input
						label="Enter Show Date & Tome"
						name="showTime"
						id="showTime"
						type="datetime-local"
						register={register}
						// min={new Date().toISOString().slice(0, 16)} // Disable past dates
						// validationSchema={{
						// 	required: "Date & Time required",
						// }}
						validationSchema={{
							required: "Date & Time required",
							validate: (value) => {
								const selectedTime = new Date(value);
								const currentTime = new Date();
								const oneHourFromNow = new Date(
									currentTime.getTime() + 60 * 60 * 1000
								);

								// Validate that the selected time is at least 1 hour from now
								if (selectedTime < oneHourFromNow) {
									return "The show time must be at least 1 hour from now.";
								}
								return true; // Valid if the selected time is after the one-hour mark
							},
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
			)}
		</section>
	);
}

export default AddShow;

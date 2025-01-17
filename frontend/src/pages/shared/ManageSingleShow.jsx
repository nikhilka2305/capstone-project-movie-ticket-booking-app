import { useContext, useEffect, useState } from "react";
import Input from "../../components/shared/formcomponents/Input";
import Button from "../../components/shared/formcomponents/Button";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "../../components/shared/formcomponents/Select";
import {
	dayJSISTtoUTC,
	dayJSUTCtoIST,
	formatDateTimeLocal,
} from "../../utils/dateFormatter.js";
import Skeleton from "../../components/shared/Skeleton.jsx";
import GoBackLink from "../../components/shared/GoBackLink.jsx";

export default function ManageSingleShow() {
	const [show, setShow] = useState({});
	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({});

	const navigate = useNavigate();
	const { user } = useContext(AuthContext);
	const [theater, setTheater] = useState({});
	const [movies, setMovies] = useState([]);

	const [loading, setLoading] = useState(true);
	const { theaterid, showid } = useParams();
	useEffect(() => {
		const defaultValues = {
			movie: show.movie?._id || "",
			showTime: show.showTime || "",
		};

		reset(defaultValues);
	}, [show, reset]);
	useEffect(() => {
		setLoading(true);

		async function fetchData() {
			const serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}`;
			try {
				const response = await axios.get(`${serverUrl}/show/${showid}`);
				const showData = response.data;

				const showTimeIST = dayJSUTCtoIST(showData.showTime);

				showData.showTime = showTimeIST;
				setShow(showData);
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
				setLoading(false);
				toast.error("Unable to fetch details");
			}
		}
		fetchData();
	}, [showid, theaterid, navigate, user.loggedUserObjectId, user.role]);

	const handleUpdateShow = async function (data, evt) {
		evt.preventDefault();
		let loadingToast = toast.loading("Updating Show....");

		const serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}/show/${showid}`;
		const show = { ...data };

		try {
			const showTimeUTC = dayJSISTtoUTC(show.showTime);

			show.showTime = showTimeUTC;

			const updateShow = await axios.patch(serverUrl, show, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			toast.dismiss(loadingToast);
			toast.success("Successfully Updated Show");
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

	const handleDeleteShow = async function () {
		let loadingToast = toast.loading("Deleting Show....");

		const serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}/show/${showid}`;
		try {
			const deleteShow = await axios.delete(serverUrl);
			toast.dismiss(loadingToast);
			toast.success("Successfully Deleted Show");
			navigate("..");
		} catch (err) {
			toast.dismiss(loadingToast);
			toast.error("Unable to Delete Show");
		}
	};

	return (
		<section className="mx-auto my-8 w-full lg:w-2/3 flex flex-col gap-8 ">
			<GoBackLink to=".." />
			<h2 className="text-center">Update Show</h2>

			{loading && <Skeleton />}
			{!loading && (
				<>
					<form
						action=""
						className="border rounded-md border-slate-900 py-8 bg-slate-200 dark:bg-slate-700 flex flex-col gap-4"
						onSubmit={handleSubmit(handleUpdateShow)}
						noValidate
					>
						<Controller
							name="movie"
							control={control}
							defaultValue={show.movie?._id || ""}
							rules={{
								required: "Please select a movie",
							}}
							render={({ field }) => (
								<Select
									label="Choose a Movie"
									field="movie"
									options={movies}
									value={field.value}
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
							<Button
								type="submit"
								label="Submit"
								disabled={show.deleted === true}
							/>
							<Button
								label="Reset"
								onClick={() => {
									reset();
								}}
								disabled={show.deleted === true}
							/>
						</div>
					</form>
					{show.deleted && (
						<p className="text-red-500 text-center">
							This show is already deleted
						</p>
					)}
					<dialog id="delete_show" className="modal">
						<div className="modal-box flex flex-col gap-4">
							<form method="dialog">
								<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
									✕
								</button>
							</form>

							<h3 className="text-center text-2xl font-bold mb-4">
								Are you sure about Deleting this Show?
							</h3>

							<Button
								colorClass="bg-red-500 text-white"
								label="Delete Movie"
								onClick={handleDeleteShow}
							/>
						</div>
					</dialog>
					<div className="button-group flex gap-4 justify-center">
						<Button
							label="Delete This Show"
							colorClass="bg-red-500 text-white"
							disabled={show.deleted === true}
							onClick={() => document.getElementById("delete_show").showModal()}
						/>
					</div>
				</>
			)}
		</section>
	);
}

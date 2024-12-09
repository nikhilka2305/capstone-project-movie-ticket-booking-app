import Input from "../../components/shared/formcomponents/Input";
import Button from "../../components/shared/formcomponents/Button";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "../../components/shared/formcomponents/Select";
import SelectActors from "../../components/shared/SelectActors";
import { buildFormData } from "../../utils/manageFormData";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { formatDateYYYYMMDD } from "../../utils/dateFormatter.js";

export default function ManageSingleMovie() {
	const [movie, setMovie] = useState({});
	const {
		control,
		register,
		handleSubmit,
		setValue,
		getValues,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			rating: movie.rating,
		},
	});
	const navigate = useNavigate();

	const { movieid } = useParams();
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const defaultValues = {
			movieName: movie.movieName || "",
			releaseDate: formatDateYYYYMMDD(movie.releaseDate) || "",
			language: movie.language || "",
			genre: movie.genre || "",
			movieduration: movie.movieduration || "",
			rating: movie.rating || "",
			movieDescription: movie.movieDescription || "",
			movieCast: movie.movieCast || [],
			director: movie.director || "",
		};

		reset(defaultValues, {
			keepDirty: false, // Optional: Resets all fields to these values
			keepTouched: true, // Optional: Keeps track of which fields were touched
		});
	}, [movie, reset]);
	useEffect(() => {
		setLoading(true);

		const serverUrl = `${
			import.meta.env.VITE_SERVER_BASE_URL
		}/movie/${movieid}`;
		async function getMovieData() {
			try {
				const response = await axios.get(`${serverUrl}`);
				const responseData = response.data;
				setMovie(responseData);
			} catch (err) {
				toast.error("Unable to Fetch Movie");
			}
		}
		getMovieData();
		setLoading(false);
	}, [movieid]);

	const handleUpdateMovie = async (data, evt) => {
		evt.preventDefault();
		const serverUrl = `${
			import.meta.env.VITE_SERVER_BASE_URL
		}/movie/${movieid}`;
		let loadingToast = toast.loading("Updating Movie....");
		const addmovie = { ...data };

		const formData = buildFormData(addmovie);
		if (addmovie.posterImage) {
			let files = addmovie.posterImage;
			for (let i = 0; i < files.length; i++) {
				formData.append("posterImage", files[i]);
			}
		}

		try {
			let movieUpdated = await axios.patch(serverUrl, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			toast.dismiss(loadingToast);
			toast.success("Successfully updated Movie");
			navigate(`/movies/managemovies`);
		} catch (err) {
			toast.dismiss(loadingToast);
			toast.error("Unable to updated Movie");
		}
	};

	const handleApproveMovie = async () => {
		const serverUrl = `${
			import.meta.env.VITE_SERVER_BASE_URL
		}/movie/${movieid}`;
		let loadingToast = toast.loading("Approving Movie....");
		try {
			let movieApproved = await axios.patch(
				serverUrl,
				{ adminApprovalStatus: "Approved" },
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			toast.dismiss(loadingToast);
			toast.success("Successfully Approved Movie");
			navigate(`..`);
		} catch (err) {
			toast.dismiss(loadingToast);
			toast.error("Unable to approve Movie");
		}
	};

	const handleDeleteMovie = async () => {
		const serverUrl = `${
			import.meta.env.VITE_SERVER_BASE_URL
		}/movie/${movieid}`;
		let loadingToast = toast.loading("Deleting Movie....");
		try {
			let movieDeleted = await axios.delete(
				serverUrl,

				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			toast.dismiss(loadingToast);
			toast.success("Successfully Deleted Movie");
			navigate(`..`);
		} catch (err) {
			toast.dismiss(loadingToast);
			toast.error("Unable to delete Movie");
		}
	};

	return (
		<section className="mx-auto my-8 w-full lg:w-2/3 flex flex-col gap-8 ">
			<Link to=".." className="text-center">
				Go Back
			</Link>
			<h2 className="text-center">Update Movie</h2>
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
					<form
						action=""
						className="border rounded-md border-slate-900 py-8 bg-slate-200 dark:bg-slate-700 flex flex-col gap-4"
						onSubmit={handleSubmit(handleUpdateMovie)}
						noValidate
					>
						<Input
							label="Enter Movie Name"
							name="movieName"
							id="movieName"
							type="text"
							register={register}
							validationSchema={{
								required: "Movie Title required",
								minLength: {
									value: 5,
									message: "Please enter a minimum of 5 characters",
								},
							}}
							errors={errors}
						/>
						<Input
							label="Enter Release Date"
							name="releaseDate"
							id="releasedate"
							type="date"
							register={register}
							validationSchema={{
								required: "Date required",
							}}
							errors={errors}
						/>
						<Input
							label="Enter Language"
							name="language"
							id="language"
							type="text"
							register={register}
							validationSchema={{
								required: "Language required",
								minLength: {
									value: 5,
									message: "Please enter a minimum of 5 characters",
								},
							}}
							errors={errors}
						/>
						<Input
							label="Enter Genre"
							name="genre"
							id="genre"
							type="text"
							register={register}
							validationSchema={{
								required: "Genre required",
								minLength: {
									value: 5,
									message: "Please enter a minimum of 5 characters",
								},
							}}
							errors={errors}
						/>
						<Input
							label="Enter Movie Duration"
							name="movieduration"
							id="movieduration"
							type="number"
							register={register}
							validationSchema={{
								required: "Duration required",
								min: {
									value: 30,
									message: "Please enter a value of atleast 30",
								},
							}}
							errors={errors}
						/>
						<Controller
							name="rating"
							control={control}
							defaultValue={movie.rating || "U/A"}
							rules={{
								required: "Please select a rating",
							}}
							render={({ field }) => (
								<Select
									label="Enter Rating"
									field="rating"
									options={["R", "U/A", "U", "A"]}
									// defaultValue={movie.rating || "U/A"}
									value={field.value || "U/A"}
									onChange={field.onChange}
									errors={errors}
								/>
							)}
						/>

						<SelectActors
							name="movieCast"
							register={register}
							setValue={setValue}
							getValues={getValues}
							maxNumber={5}
							errors={errors}
							validationSchema={{
								minLength: {
									value: 5,
									message: "At least 5 characters required.",
								},
								maxLength: {
									value: 20,
									message: "Maximum 20 characters allowed.",
								},
							}}
						/>
						<Input
							label="Enter Movie Director"
							name="director"
							id="director"
							type="text"
							register={register}
							validationSchema={{
								required: "Director required",
								minLength: {
									value: 5,
									message: "Please enter a minimum of 5 characters",
								},
							}}
							errors={errors}
						/>
						<Input
							label="Add Movie Description"
							name="movieDescription"
							id="movieDescription"
							type="textarea"
							register={register}
							validationSchema={{
								required: "Description required",
								minLength: {
									value: 30,
									message: "Please enter minimum of 30 characters",
								},
							}}
							errors={errors}
						/>

						<div className="flex flex-col gap-4">
							{movie.posterImage && (
								<div className="mx-auto flex items-center gap-4">
									<img
										src={movie.posterImage} // Fetched poster URL
										alt="Movie Poster"
										className="h-20 w-20 object-cover rounded"
									/>
									<span className="text-sm text-gray-500">Current Poster</span>
								</div>
							)}
							<Input
								label="Add Poster Image"
								name="posterImage"
								id="posterImage"
								type="file"
								classes="file-input file-input-lg file-input-ghost w-full"
								fileTypes={["image/jpeg", " image/jpg", " image/png"]}
								register={register}
								errors={errors}
							/>
						</div>

						<div className="button-group flex gap-4 justify-center">
							<Button
								type="submit"
								label="Submit"
								disabled={movie.adminApprovalStatus === "Deleted"}
							/>
							<Button
								label="Reset"
								onClick={() => {
									reset();
								}}
								disabled={movie.adminApprovalStatus === "Deleted"}
							/>
						</div>
					</form>
					{movie.adminApprovalStatus !== "Approved" && (
						<p className="text-red-500 text-center">
							The status of this movie is {movie.adminApprovalStatus}
						</p>
					)}

					<dialog id="delete_movie" className="modal">
						<div className="modal-box flex flex-col gap-4">
							<form method="dialog">
								<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
									✕
								</button>
							</form>

							<h3 className="text-center text-2xl font-bold mb-4">
								Are you sure about Deleting this Movie: {movie.movieName}?
							</h3>

							<Button
								colorClass="bg-red-500 text-white"
								label="Delete Movie"
								onClick={handleDeleteMovie}
							/>
						</div>
					</dialog>
					<dialog id="approve_movie" className="modal">
						<div className="modal-box flex flex-col gap-4">
							<form method="dialog">
								<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
									✕
								</button>
							</form>

							<h3 className="text-center text-2xl font-bold mb-4">
								Are you sure about Approving this Movie: {movie.movieName}?
							</h3>

							<Button
								colorClass="bg-green-500 text-white"
								label="Approve Movie"
								onClick={handleApproveMovie}
							/>
						</div>
					</dialog>

					<div className="button-group flex gap-4 justify-center">
						<Button
							label="Approve This Movie"
							colorClass="bg-green-500 text-white"
							disabled={movie.adminApprovalStatus !== "Pending"}
							onClick={() =>
								document.getElementById("approve_movie").showModal()
							}
						/>
						<Button
							label="Delete This Movie"
							colorClass="bg-red-500 text-white"
							disabled={movie.adminApprovalStatus === "Deleted"}
							onClick={() =>
								document.getElementById("delete_movie").showModal()
							}
						/>
					</div>
				</>
			)}
		</section>
	);
}

import { useState } from "react";
import Input from "../../components/shared/formcomponents/Input";
import Button from "../../components/shared/formcomponents/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "../../components/shared/formcomponents/Select";
import SelectActors from "../../components/shared/SelectActors";
import { buildFormData } from "../../utils/manageFormData";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

export default function AddMovie() {
	const {
		control,
		register,
		handleSubmit,
		setValue,
		getValues,
		reset,
		formState: { errors },
	} = useForm();

	const navigate = useNavigate();
	const serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}/movie/addmovie`;
	const handleAddMovie = async (data, evt) => {
		evt.preventDefault();
		let loadingToast = toast.loading("Adding Movie....");
		const addmovie = { ...data };
		console.log(addmovie);
		console.log(addmovie.posterImage);
		if (!addmovie.posterImage) throw new Error("You must include movie poster");

		const formData = buildFormData(addmovie);
		console.log(data.FileList);
		console.log("Form Data");
		console.log(formData);
		let files = addmovie.posterImage;
		for (let i = 0; i < files.length; i++) {
			formData.append("posterImage", files[i]);
		}

		for (let pair of formData.entries()) {
			console.log(pair[0] + ": " + pair[1]); // Logs "name: John Doe", "age: 30"
		}

		try {
			console.log("Data");
			console.log(data);

			let movieAdded = await axios.post(serverUrl, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			console.log(movieAdded);
			toast.dismiss(loadingToast);
			toast.success("Successfully Added Movie");
			navigate("/movies");
		} catch (err) {
			console.log(err);
			toast.dismiss(loadingToast);
			toast.error("Unable to Add Movie");
		}
	};

	return (
		<section className="mx-auto my-8 w-full lg:w-2/3 flex flex-col gap-8 ">
			<h2 className="text-center">Add New Movie</h2>

			<form
				action=""
				className="border rounded-md border-slate-900 py-8 bg-slate-200 dark:bg-slate-700 flex flex-col gap-4"
				onSubmit={handleSubmit(handleAddMovie)}
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
					defaultValue="U/A"
					rules={{
						required: "Please select a rating",
					}}
					render={({ field }) => (
						<Select
							label="Enter Rating"
							field="rating"
							options={["R", "U/A", "U", "A"]}
							defaultValue="U/A"
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

				<Input
					label="Add poster Image"
					name="posterImage"
					id="posterImage"
					type="file"
					classes="file-input file-input-lg file-input-ghost w-full"
					fileTypes={["image/jpeg", " image/jpg", " image/png"]}
					register={register}
					validationSchema={{
						required: "Poster required",
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
		</section>
	);
}

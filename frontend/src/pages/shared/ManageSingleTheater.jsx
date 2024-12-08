import { useContext, useEffect, useState } from "react";
import Input from "../../components/shared/formcomponents/Input";
import Button from "../../components/shared/formcomponents/Button";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "../../components/shared/formcomponents/Select";
import { buildFormData } from "../../utils/manageFormData";
import { AuthContext } from "../../context/AuthContext";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";
import ForwardedInput from "../../components/shared/ForwardedInput";

export default function ManageSingleTheater() {
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
	const [theater, setTheater] = useState({
		theaterName: "",
		location: "",
		owner: "",
		seats: {
			rows: "",
			seatsPerRow: "",
		},
		seatClasses: [
			{
				className: "",
				price: "",
			},
		],
		amenities: {
			parking: "",
			restroom: "",
			foodCounters: "",
		},
		theaterimages: "",
	});
	const { user } = useContext(AuthContext);
	const { ownerid, theaterid } = useParams();
	const { fields, append, remove } = useFieldArray({
		control,
		name: "seatClasses",
	});
	useEffect(() => {
		const defaultValues = {
			theaterName: theater.theaterName || "",
			location: theater.location || "",
			owner: theater.owner || "",
			seats: {
				rows: theater.seats.rows || "",
				seatsPerRow: theater.seats.seatsPerRow || "",
			},
			seatClasses:
				theater.seatClasses.length > 0
					? theater.seatClasses
					: [{ className: "", price: "" }],
			amenities: {
				parking: theater.amenities.parking || "",
				restroom: theater.amenities.restroom || "",
				foodCounters: theater.amenities.foodCounters || "",
			},
		};

		reset(defaultValues);
	}, [theater, reset]);
	const [owners, setOwners] = useState([]);
	const [loading, setLoading] = useState();

	const [feedback, setFeedback] = useState("");

	const handleRemoveSeatClass = (index) => {
		if (fields.length === 1) {
			setFeedback("There must be at least one seat class.");
			return;
		}
		setFeedback(""); // Clear feedback if the action is valid
		remove(index);
	};
	useEffect(() => {
		if (user.role !== "Admin" && ownerid !== user.loggedUserId) {
			navigate(`./theaterowner/${user.loggedUserId}`);
		}
		const serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}`;
		async function getOwners() {
			setLoading(true);
			const apiUrl = `${serverUrl}/theaterowner`;

			try {
				const theaterOwners = await axios.get(apiUrl, {
					params: { active: true },
				});

				setOwners(theaterOwners.data);
			} catch (err) {
				toast.error("Unable to fetch owner data");
			}
		}
		async function fetchTheaterData() {
			try {
				const apiUrl = `${serverUrl}/theater/${theaterid}/viewmanage`;
				const response = await axios.get(apiUrl);

				const theaterData = response.data;
				setTheater(theaterData);
			} catch (err) {
				toast.error("Unable to fetch theater data");
			}
		}
		if (user.role === "Admin") {
			getOwners();
		}
		fetchTheaterData();
		setLoading(false);
	}, [theaterid, ownerid, navigate, user.loggedUserId, user.role]);

	const handleUpdateTheater = async (data, evt) => {
		evt.preventDefault();

		let loadingToast = toast.loading("Updating Theater....");
		const addtheater = { ...data };
		if (user.role === "TheaterOwner") {
			addtheater.owner = user.loggedUserObjectId;
		}

		const theaterFD = buildFormData(addtheater);

		let files = addtheater.theaterimages;
		for (let i = 0; i < files.length; i++) {
			theaterFD.append("theaterimages", files[i]);
		}

		const serverUrl = `${
			import.meta.env.VITE_SERVER_BASE_URL
		}/theater/${theaterid}`;

		try {
			const theaterUpdated = await axios.patch(serverUrl, theaterFD, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			toast.dismiss(loadingToast);
			toast.success("Successfully Updated Theater");

			navigate("seatmanagement");
		} catch (err) {
			toast.error("Unable to Update Theater");
			toast.dismiss(loadingToast);
		}
	};

	const handleApproveTheater = async () => {
		const serverUrl = `${
			import.meta.env.VITE_SERVER_BASE_URL
		}/theater/${theaterid}`;
		let loadingToast = toast.loading("Approving Theater....");
		try {
			let theaterApproved = await axios.patch(
				serverUrl,
				{ adminApprovalStatus: "Approved" },
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			toast.dismiss(loadingToast);
			toast.success("Successfully Approved Theater");
			navigate(`/theaters/managetheaters`);
		} catch (err) {
			toast.dismiss(loadingToast);
			toast.error("Unable to approve Theater");
		}
	};

	const handleDeleteTheater = async () => {
		const serverUrl = `${
			import.meta.env.VITE_SERVER_BASE_URL
		}/theater/${theaterid}`;
		let loadingToast = toast.loading("Deleting Theater....");
		try {
			let theaterDeleted = await axios.delete(
				serverUrl,

				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			toast.dismiss(loadingToast);
			toast.success("Successfully Deleted Theater");
			navigate(`/theaters/managetheaters`);
			if (user.role == "TheaterOwner")
				navigate(`/theaterowner/${user?.loggedUserId}`);
			else navigate(`/admin/${user?.loggedUserId}`);
		} catch (err) {
			toast.dismiss(loadingToast);
			toast.error("Unable to delete Theater");
		}
	};

	return (
		<section className="mx-auto my-8 w-full lg:w-2/3 flex flex-col gap-8 ">
			<h1 className="text-center text-2xl font-semibold">
				Update Theater: {theater.theaterName}
			</h1>
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
					<div className="flex gap-4 mx-auto">
						{theater.adminApprovalStatus !== "Deleted" && (
							<Link
								to="seatmanagement"
								className="text-center border rounded-md hover:bg-blue-gray-400 hover:text-gray-100 p-2"
							>
								Seat Management
							</Link>
						)}
						{theater.adminApprovalStatus === "Approved" && (
							<>
								<Link
									to="addshow"
									className="text-center border rounded-md hover:bg-blue-gray-400 hover:text-gray-100 p-2"
								>
									Add Show
								</Link>
								<Link
									to="manageshows"
									className="text-center border rounded-md hover:bg-blue-gray-400 hover:text-gray-100 p-2"
								>
									Manage Theater Shows
								</Link>
							</>
						)}
					</div>

					{theater.adminApprovalStatus !== "Approved" && (
						<p className="text-red-500 text-center">
							The status of this theater is {theater.adminApprovalStatus}
						</p>
					)}
					<form
						action=""
						className="border rounded-md border-slate-900 py-8 bg-slate-200 dark:bg-slate-700 flex flex-col gap-4"
						onSubmit={handleSubmit(handleUpdateTheater)}
						noValidate
					>
						<Input
							label="Enter Theater Name"
							name="theaterName"
							id="theaterName"
							type="text"
							register={register}
							validationSchema={{
								required: "Theater Name required",
								minLength: {
									value: 5,
									message: "Please enter a minimum of 5 characters",
								},
							}}
							errors={errors}
						/>
						<Input
							label="Enter Location"
							name="location"
							id="location"
							type="text"
							register={register}
							validationSchema={{
								required: "Location required",
								minLength: {
									value: 5,
									message: "Please enter a minimum of 5 characters",
								},
							}}
							errors={errors}
						/>
						{user.role === "Admin" && (
							<Controller
								name="owner"
								control={control}
								defaultValue={""}
								rules={{
									required: "Please select a rating",
								}}
								render={({ field }) => (
									<Select
										label="Select an Owner"
										field="owner"
										options={owners}
										value={field.value}
										displayKey="username"
										valueKey="_id"
										defaultValue={""}
										onChange={field.onChange}
										errors={errors}
									/>
								)}
							/>
						)}

						<Input
							label="Enter No: of Rows"
							name="seats.rows"
							id="rows"
							type="number"
							register={register}
							validationSchema={{
								required: "No of Rows required",
								min: {
									value: 5,
									message: "Rows cannot be less than 5",
								},
							}}
							errors={errors}
						/>
						<Input
							label="Enter Seats Per Row"
							name="seats.seatsPerRow"
							id="seatsPerRow"
							type="number"
							register={register}
							validationSchema={{
								required: "No of Rows required",
								min: {
									value: 5,
									message: "Seats per Row cannot be less than 5",
								},
							}}
							errors={errors}
						/>
						{/* {theater.seatClasses.map((seatClass, index) => ( */}
						{fields.map((seatClass, index) => (
							<div
								key={`seatClass-${index}`}
								className="flex gap-4 items-center flex-wrap mx-auto max-w-full"
							>
								<Controller
									name={`seatClasses.${index}.className`}
									control={control}
									rules={{
										required: "Class Name required",
										minLength: {
											value: 3,
											message: "Minimum 3 characters required",
										},
									}}
									render={({ field }) => (
										<ForwardedInput
											{...field}
											label="Class Name"
											type="text"
											errors={errors}
										/>
									)}
								/>

								<Controller
									name={`seatClasses.${index}.price`}
									control={control}
									rules={{
										required: "Price required",
										min: { value: 0, message: "Price must be greater than 0" },
									}}
									render={({ field }) => (
										<ForwardedInput
											{...field}
											label="Price"
											type="number"
											errors={errors}
										/>
									)}
								/>

								<button
									className="flex flex-col justify-center px-8"
									type="button"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										className="size-8 hover:text-red-700 "
										onClick={() => handleRemoveSeatClass(index)}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
										/>
									</svg>
								</button>
							</div>
						))}
						{feedback && (
							<p className="text-red-500 mt-2 mx-auto">{feedback}</p>
						)}

						<Button
							label="Add Seat Class"
							onClick={() => {
								append({ className: "", price: "" });
								setFeedback("");
							}}
							type="button"
							colorClass="bg-blue-500 text-white hover:bg-white hover:text-blue-500 my-4"
						/>

						<h2 className="px-12 text-lg font-semibold text-center my-4">
							Add Amenities Details
						</h2>

						<Input
							label="Enter Parking Details"
							name="amenities.parking"
							id="parking"
							type="textarea"
							register={register}
							validationSchema={{
								minLength: {
									value: 20,
									message: "Enter atleast 20 characters",
								},
							}}
							errors={errors}
						/>
						<Input
							label="Enter Restroom Details"
							name="amenities.restroom"
							id="restroom"
							type="textarea"
							register={register}
							validationSchema={{
								minLength: {
									value: 20,
									message: "Enter atleast 20 characters",
								},
							}}
							errors={errors}
						/>
						<Input
							label="Enter Food Counter Details"
							name="amenities.foodCounters"
							id="foodCounter"
							type="textarea"
							register={register}
							validationSchema={{
								minLength: {
									value: 20,
									message: "Enter atleast 20 characters",
								},
							}}
							errors={errors}
						/>
						<div className="flex flex-col gap-4">
							{theater.images?.length && (
								<div className="mx-auto flex items-center gap-4">
									{theater.images.map((image, i) => (
										<img
											key={i}
											src={image} // Fetched poster URL
											alt="Movie Poster"
											className="h-20 w-20 object-cover rounded"
										/>
									))}

									<span className="text-sm text-gray-500">Current Images</span>
								</div>
							)}
							<Input
								label="Add poster Image"
								name="theaterimages"
								id="theaterimages"
								type="file"
								multiple
								classes="file-input file-input-lg file-input-ghost w-full"
								fileTypes={["image/jpeg", " image/jpg", " image/png"]}
								register={register}
								errors={errors}
							/>
						</div>
						<div className="button-group flex gap-4 justify-center">
							<Button
								label="Submit"
								type="submit"
								disabled={theater.adminApprovalStatus === "Deleted"}
							/>
							<Button
								label="Reset"
								onClick={() => {
									reset();
								}}
								disabled={theater.adminApprovalStatus === "Deleted"}
							/>
						</div>
					</form>
					{theater.adminApprovalStatus !== "Approved" && (
						<p className="text-red-500 text-center">
							The status of this theater is {theater.adminApprovalStatus}
						</p>
					)}
					<dialog id="delete_theater" className="modal">
						<div className="modal-box flex flex-col gap-4">
							<form method="dialog">
								<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
									✕
								</button>
							</form>

							<h3 className="text-center text-2xl font-bold mb-4">
								Are you sure about Deleting this Theater: {theater.theaterName}?
							</h3>

							<Button
								colorClass="bg-red-500 text-white"
								label="Delete Theater"
								onClick={handleDeleteTheater}
							/>
						</div>
					</dialog>
					<dialog id="approve_theater" className="modal">
						<div className="modal-box flex flex-col gap-4">
							<form method="dialog">
								<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
									✕
								</button>
							</form>

							<h3 className="text-center text-2xl font-bold mb-4">
								Are you sure about Approving this Theater: {theater.theaterName}
								?
							</h3>

							<Button
								colorClass="bg-green-500 text-white"
								label="Approve Theater"
								onClick={handleApproveTheater}
							/>
						</div>
					</dialog>

					<div className="button-group flex gap-4 justify-center">
						{user.role === "Admin" && (
							<Button
								label="Approve This Theater"
								colorClass="bg-green-500 text-white"
								disabled={theater.adminApprovalStatus !== "Pending"}
								onClick={() =>
									document.getElementById("approve_theater").showModal()
								}
							/>
						)}
						<Button
							label="Delete This Theater"
							colorClass="bg-red-500 text-white"
							disabled={theater.adminApprovalStatus === "Deleted"}
							onClick={() =>
								document.getElementById("delete_theater").showModal()
							}
						/>
					</div>
				</>
			)}
		</section>
	);
}

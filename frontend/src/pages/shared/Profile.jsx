import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import MoviePreferences from "../../components/user/MoviePreferences";
import Input from "../../components/shared/formcomponents/Input";
import Button from "../../components/shared/formcomponents/Button";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { buildFormData } from "../../utils/manageFormData";
import SelectActors from "../../components/shared/SelectActors";

function Profile({ type, idtype }) {
	const { isAuthenticated, user, setAuth, checkAuth } = useContext(AuthContext);
	const [userData, setUserData] = useState({
		username: "",
		email: "",
		mobile: "",
	});
	const {
		register,
		handleSubmit,
		reset,
		getValues,
		setValue,
		formState: { errors },
	} = useForm();
	useEffect(() => {
		const defaultValues = {
			username: userData.username || "",
			email: userData.email || "",
			mobile: userData.mobile || "",
			...(user.role === "User" && {
				moviePreferences: {
					genre: userData.moviePreferences?.genre || "",
					favactors: userData.moviePreferences?.favactors || [],
				},
			}),
		};

		reset(defaultValues, {
			keepDirty: false, // Optional: Resets all fields to these values
			keepTouched: true, // Optional: Keeps track of which fields were touched
		});
	}, [userData, user.role, reset]);

	const [isEdittable, setIsEdittable] = useState(false);
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);

	const params = useParams();
	const [showUploadForm, setShowUploadForm] = useState(false);
	const idValue = params[idtype];

	useEffect(() => {
		const serverUrl = `${
			import.meta.env.VITE_SERVER_BASE_URL
		}/${type}/${idValue}/profile`;
		setLoading(true);
		async function getUser() {
			try {
				const response = await axios.get(`${serverUrl}`);
				const responseData = response.data;

				setUserData(responseData);
				reset({
					email: responseData.email || "",
					mobile: responseData.mobile || "",
				});
			} catch (err) {
				if (!isAuthenticated) navigate("/");
				else if (isAuthenticated && user.role === "User")
					navigate(`/user/${user.loggedUserId}/profile`);
				else if (isAuthenticated && user.role === "TheaterOwner")
					navigate(`/theaterowner/${user.loggedUserId}/profile`);
				else if (isAuthenticated && user.role === "Admin")
					navigate(`/admin/${user.loggedUserId}/profile`);
			}
		}
		setLoading(false);
		getUser();
	}, [idValue, navigate, isAuthenticated, user, type]);

	useEffect(() => {});

	const handleUploadPhoto = async function (data, evt) {
		evt.preventDefault();
		let loadingToast = toast.loading("Adding Display image....");

		const userInfo = { ...data };

		const userFormData = buildFormData(userInfo);
		let files = userInfo.displayimage;
		for (let i = 0; i < files.length; i++) {
			userFormData.append("displayimage", files[i]);
		}

		try {
			const serverUrl = `${
				import.meta.env.VITE_SERVER_BASE_URL
			}/${type}/${idValue}/profile`;
			let userInfoData = await axios.patch(serverUrl, userFormData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			setUserData((prev) => ({
				...prev,
				displayImage: userInfoData.data.user.displayImage,
			}));
			toast.dismiss(loadingToast);
			reset();
			setShowUploadForm(false);
			toast.success("Successfully Updated IMage");
		} catch (err) {
			toast.dismiss(loadingToast);
			toast.error("Unable to update Image");
		}
		// if (!userInfo.posterImage) throw new Error("You must include movie poster");
	};

	const filterUserData = (data, role) => {
		const filteredData = { ...data };

		if (role === "User") {
			// Ensure `moviePreferences` exists for users
			filteredData.moviePreferences = filteredData.moviePreferences || {
				favGenre: "",
				favActors: [],
			};
		} else {
			// Remove `moviePreferences` for non-user roles
			delete filteredData.moviePreferences;
		}

		return filteredData;
	};

	const handleEditDetails = async function (data, evt) {
		evt.preventDefault();
		let loadingToast = toast.loading("Updating....");

		const updatedInfo = filterUserData(data, user.role);

		const serverUrl = `${
			import.meta.env.VITE_SERVER_BASE_URL
		}/${type}/${idValue}/profile`;
		try {
			let updatedUserInfo = await axios.patch(serverUrl, updatedInfo, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			setUserData((prev) => ({
				...prev,
				...updatedUserInfo.data.user,
			}));
			toast.dismiss(loadingToast);
			reset(updatedUserInfo.data.user);
			setIsEdittable(false);
			toast.success("Succesfully updated details");
		} catch (err) {
			toast.dismiss(loadingToast);
			toast.error("Unable to update details");
		}
	};

	const handleDeleteUser = async function (evt) {
		evt.preventDefault();

		let loadingToast = toast.loading("Deleting ", idValue);
		const serverUrl = `${
			import.meta.env.VITE_SERVER_BASE_URL
		}/${type}/${idValue}/`;
		try {
			const deletedUserInfo = await axios.delete(serverUrl);

			toast.dismiss(loadingToast);

			await checkAuth();
			toast.success("Succesfully deleted ", idValue);
			// await logOut();
			navigate("/login");
		} catch (err) {
			toast.dismiss(loadingToast);
			toast.error("Unable to delete ", idValue);
		}
	};

	return (
		<>
			{loading && <div>Loading..</div>}
			{userData ? (
				<div className="py-8 px-8 w-2/3 min-h-full mx-auto rounded-xl shadow-lg space-y-2 sm:py-4 flex flex-col gap-8 sm:items-center sm:space-y-0 sm:space-x-6 my-16">
					<img
						className="block mx-auto h-24 rounded-full sm:mx-0 sm:shrink-0"
						src={
							userData.displayImage
								? userData.displayImage
								: "https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg"
						}
						alt={`Profile photo of ${userData.username}`}
					/>
					{showUploadForm && (
						<form
							className="showUploadForm flex flex-col items-center gap-4"
							onSubmit={handleSubmit(handleUploadPhoto)}
							noValidate
						>
							<Input
								type="file"
								label="Upload Profile Picture"
								name="displayimage"
								id="displayimage"
								classes="file-input file-input-lg file-input-ghost w-full"
								fileTypes={["image/jpeg", " image/jpg", " image/png"]}
								register={register}
								validationSchema={{
									required: "Image required",
								}}
								errors={errors}
							></Input>
							<div className="button-group flex gap-4 justify-center">
								<Button type="submit" label="Submit" />
								<Button
									label="Cancel"
									onClick={() => {
										reset();
										setShowUploadForm(false);
									}}
								/>
							</div>
						</form>
					)}
					{!showUploadForm && (
						<button type="button" onClick={() => setShowUploadForm(true)}>
							Update Photo
						</button>
					)}
					<div className="text-center space-y-2 sm:text-left ">
						<div className="space-y-0.5 flex flex-col gap-4 items-center">
							<p className="text-xl text-black font-semibold">
								{userData.username}
							</p>
							<form
								className="showEditDetailsForm flex flex-col gap-4 items-center"
								onSubmit={handleSubmit(handleEditDetails)}
								noValidate
							>
								<Input
									label="Enter Email"
									name="email"
									id="email"
									type="email"
									register={register}
									validationSchema={{
										required: "Email required",
										pattern: {
											value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
											message: "invalid email address",
										},
									}}
									errors={errors}
									disabled={!isEdittable}
								/>
								<Input
									label="Enter Mobile"
									name="mobile"
									id="mobile"
									type="number"
									register={register}
									validationSchema={{
										required: "Mobile required",
										minLength: {
											value: 10,
											message: "Please enter a minimum of 10 characters",
										},
										maxLength: {
											value: 10,
											message: "Please enter a maximum of 10 characters",
										},
									}}
									errors={errors}
									disabled={!isEdittable}
								/>
								{userData && userData.role === "User" && (
									// <MoviePreferences
									// 	preferenceData={userData.moviePreferences}
									// />
									<>
										<Input
											label="Genre"
											name="moviePreferences.genre"
											type="text"
											id="genre"
											register={register}
											validationSchema={{
												minLength: {
													value: 5,
													message: "Please enter a minimum of 5 characters",
												},
												maxLength: {
													value: 15,
													message: "Please enter a maximum of 15 characters",
												},
											}}
											errors={errors}
											disabled={!isEdittable}
										/>
										<SelectActors
											name="moviePreferences.favactors"
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
											disabled={!isEdittable}
										/>
									</>
								)}
								{isEdittable && (
									<div className="button-group flex gap-4 justify-center">
										<Button type="submit" label="Submit" />
										<Button
											label="Cancel"
											onClick={() => {
												reset();
												setIsEdittable(false);
											}}
										/>
									</div>
								)}
							</form>
							{(userData.deleted || userData.blocked) && (
								<p>This account is deleted or blocked</p>
							)}

							{!isEdittable && (
								<div className="flex justify-between w-full mt-8 mx-auto">
									<button type="button" onClick={() => setIsEdittable(true)}>
										Edit profile Details
									</button>
									{!userData.deleted && (
										<button
											className="btn"
											onClick={() =>
												document.getElementById("my_modal_4").showModal()
											}
										>
											Delete Your Account?
										</button>
									)}

									<dialog id="my_modal_4" className="modal">
										<div className="modal-box w-11/12 max-w-5xl">
											<h3 className="font-bold text-lg">Deleting Account</h3>
											<p className="py-4">Are You Sure?</p>
											<div className="modal-action">
												<form method="dialog">
													{/* if there is a button, it will close the modal */}
													<div className="button-group flex gap-4 justify-center">
														<Button
															type="submit"
															label="Delete"
															colorClass="bg-red-600 text-white"
															onClick={handleDeleteUser}
														/>

														<Button
															type="submit"
															label="Cancel"
															colorClass="bg-green-500"
														/>
													</div>
												</form>
											</div>
										</div>
									</dialog>
								</div>
							)}
						</div>
					</div>
				</div>
			) : (
				<></>
			)}
		</>
	);
}

export default Profile;

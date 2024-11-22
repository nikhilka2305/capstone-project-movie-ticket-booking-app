import { useContext, useEffect, useState } from "react";
import Input from "../../components/shared/formcomponents/Input";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../components/shared/formcomponents/Button";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

function OwnerLogin() {
	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		reset,
		formState: { errors },
	} = useForm();

	axios.defaults.withCredentials = true;

	const [error, setError] = useState("");
	const navigate = useNavigate();
	const { isAuthenticated, login, checkAuth } = useContext(AuthContext);

	useEffect(() => {
		if (isAuthenticated) navigate("/");
	}, []);

	const serverUrl = `${
		import.meta.env.VITE_SERVER_BASE_URL
	}/theaterowner/login`;
	const handleLoginFormSubmit = async (data, evt) => {
		evt.preventDefault();
		const user = { ...data };
		console.log(user);
		try {
			const userSignup = await axios.post(serverUrl, user, {
				headers: {
					"Content-Type": "application/json",
				},
				withCredentials: true,
			});
			console.log("Login Success");
			toast.success("Successfully LoggedIn");
			console.log(userSignup);
			login(userSignup.data.user);
			await checkAuth();

			navigate("/theaterowner");
		} catch (err) {
			console.log(err);
			setError("Unable to Log In");
			toast.error("Unable to Login");
		}
	};
	return (
		<section className="mx-auto my-8 w-full sm:w-1/2 lg:w-1/3 flex flex-col gap-8 ">
			<h2 className="text-center">Login</h2>
			<form
				action=""
				className="border rounded-md border-slate-900 py-8 bg-slate-200 dark:bg-slate-700 flex flex-col gap-4"
				onSubmit={handleSubmit(handleLoginFormSubmit)}
				noValidate
			>
				<Input
					label="Enter Username"
					name="username"
					id="username"
					type="text"
					register={register}
					validationSchema={{
						required: "Username required",
					}}
					errors={errors}
				/>
				<Input
					label="Enter Password"
					name="password"
					id="password"
					type="password"
					register={register}
					validationSchema={{
						required: "Password required",
					}}
					errors={errors}
				/>
				<div className="button-group flex gap-4 justify-center">
					<Button
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
			{error && <p className="text-red-600 mx-auto my-4">{error}</p>}
		</section>
	);
}

export default OwnerLogin;

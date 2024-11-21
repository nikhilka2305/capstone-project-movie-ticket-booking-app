import { useContext, useEffect, useState } from "react";
import Input from "../../components/shared/formcomponents/Input";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../components/shared/formcomponents/Button";
import axios from "axios";
import toast from "react-hot-toast";

export default function Login() {
	const [username, setUsername] = useState("");
	axios.defaults.withCredentials = true;
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const { isAuthenticated, login, checkAuth } = useContext(AuthContext);

	useEffect(() => {
		if (isAuthenticated) navigate("/");
	}, []);
	const serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}/user/login`;
	const handleLoginFormSubmit = async (evt) => {
		evt.preventDefault();
		console.log({ username, password });
		const user = { username, password };
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

			navigate("/user");
		} catch (err) {
			console.log(err);
			setError("Unable to Log In");
			toast.error("Unable to Login");
		}
	};
	// const navigate = useNavigate();

	return (
		<section className="mx-auto my-8 w-full sm:w-1/2 lg:w-1/3 flex flex-col gap-8 ">
			<h2 className="text-center">Login</h2>
			<form
				action=""
				className="border rounded-md border-slate-900 py-8 bg-slate-200 dark:bg-slate-700 flex flex-col gap-4"
				onSubmit={handleLoginFormSubmit}
			>
				<Input
					label="Enter Username"
					name="username"
					id="username"
					type="text"
					required
					value={username}
					onChange={setUsername}
					minlength="5"
					maxlength="15"
				/>
				<Input
					label="Enter Password"
					name="password"
					id="password"
					type="password"
					required
					value={password}
					onChange={setPassword}
					minlength="5"
					maxlength="15"
				/>
				<Button label="Login" />
			</form>
			{error && <p className="text-red-600">{error}</p>}
		</section>
	);
}

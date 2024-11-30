import Input from "../../components/shared/formcomponents/Input";
import Button from "../../components/shared/formcomponents/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

function AdminSignUp() {
	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		reset,
		formState: { errors },
	} = useForm();
	const navigate = useNavigate();
	const serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}/admin/register`;
	const handleSignUpFormSubmit = async (data, evt) => {
		evt.preventDefault();

		const user = { ...data };

		try {
			const userSignup = await axios.post(serverUrl, user, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			toast.success("Successfully Signed up");
			navigate("/adminauth/adminlogin");
		} catch (err) {
			toast.error("Unable to Signup");
		}
	};

	return (
		<section className="mx-auto my-8 w-full sm:w-1/2 lg:w-1/3 flex flex-col gap-8 ">
			<h2 className="text-center">Register New Theater Owner</h2>
			<form
				action=""
				className="border rounded-md border-slate-900 py-8 bg-slate-200 dark:bg-slate-700 flex flex-col gap-4"
				onSubmit={handleSubmit(handleSignUpFormSubmit)}
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
						minLength: {
							value: 5,
							message: "Please enter a minimum of 5 characters",
						},
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
						minLength: {
							value: 6,
							message: "Please enter a minimum of 6 characters",
						},
					}}
					errors={errors}
				/>
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
				/>
				<div className="button-group flex gap-4 justify-center">
					<Button label="Submit" />
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

export default AdminSignUp;

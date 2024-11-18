import Login from "../pages/user/Login";
import SignUp from "../pages/user/SignUp";

export const UserSignUpRoute = {
	path: "signup",
	element: <SignUp />,
};

export const UserLoginRoute = {
	path: "login",
	element: <Login />,
};

export const TheaterOwnerSignUpRoute = {
	path: "tosignup",
	element: <p>Sign up</p>,
};

export const TheaterOwnerLoginRoute = {
	path: "tologin",
	element: <p>Login</p>,
};

export const AdminSignUpRoute = {
	path: "adminsignup",
	element: <p>Sign up</p>,
};

export const AdminLoginRoute = {
	path: "adminlogin",
	element: <p>Login</p>,
};

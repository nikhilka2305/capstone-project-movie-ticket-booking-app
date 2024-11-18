import AdminLogin from "../pages/admin/AdminLogin";
import AdminSignUp from "../pages/admin/AdminSignUp";
import OwnerLogin from "../pages/theaterOwner/OwnerLogin";
import OwnerSignUp from "../pages/theaterOwner/OwnerSignUp";
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
	element: <OwnerSignUp />,
};

export const TheaterOwnerLoginRoute = {
	path: "tologin",
	element: <OwnerLogin />,
};

export const AdminSignUpRoute = {
	path: "adminsignup",
	element: <AdminSignUp />,
};

export const AdminLoginRoute = {
	path: "adminlogin",
	element: <AdminLogin />,
};

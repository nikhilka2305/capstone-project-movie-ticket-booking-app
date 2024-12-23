import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

import { ProfileRoute, UserDashboard } from "./UserRoutes";
import {
	AdminLoginRoute,
	AdminSignUpRoute,
	TheaterOwnerLoginRoute,
	TheaterOwnerSignUpRoute,
	UserLoginRoute,
	UserSignUpRoute,
} from "./AuthRoutes";
import { OwnerDashboard, OwnerProfileRoute } from "./TheaterOwnerRoutes";
import {
	AdminDashboard,
	AdminProfileRoute,
	TheaterOwnerManagementRoute,
	UserManagementRoute,
} from "./AdminRoutes";
import {
	AddMovieRoute,
	MovieManagementRoute,
	MovieRoutes,
} from "./MovieRoutes";
import { TheaterManagementRoute, TheaterRoutes } from "./TheaterRoutes";
import { ShowRoutes } from "./ShowRoutes";
import { IndividualReview, ManageReview, ReviewRoutes } from "./ReviewRoutes";
import { TheaterBookingRoute } from "./BookingRoutes";

import ProtectRoute from "../hooks/ProtectRoute";
import Home from "../pages/shared/Home";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";
import Error404 from "../pages/shared/Error404";
import PaymentSuccess from "../pages/shared/PaymentSuccess";
import PaymentFailed from "../pages/shared/PaymentFailed";

export default function RouteIndex() {
	const router = createBrowserRouter([
		{
			path: "/",
			element: (
				<>
					<Header />
					<Outlet />
					<Footer />
				</>
			),
			children: [
				{
					index: true,
					element: <Home />,
				},

				UserLoginRoute,
				UserSignUpRoute,
				MovieRoutes,
				ShowRoutes,
				TheaterRoutes,
			],
		},
		{
			path: "/toauth",
			element: (
				<>
					<Header />
					<Outlet />
					<Footer />
				</>
			),
			children: [
				{
					index: true, // Redirect when "/movies" is accessed
					element: <Navigate to="tologin" replace />,
				},
				TheaterOwnerLoginRoute,
				TheaterOwnerSignUpRoute,
			],
		},
		{
			path: "/adminauth",
			element: (
				<>
					<Header />
					<Outlet />
					<Footer />
				</>
			),
			children: [
				{
					index: true, // Redirect when "/movies" is accessed
					element: <Navigate to="adminlogin" replace />,
				},
				AdminLoginRoute,
				AdminSignUpRoute,
			],
		},
		{
			path: "/user",
			element: (
				<>
					<Header />
					<ProtectRoute roles={["User", "Admin"]}>
						<Outlet />
					</ProtectRoute>
					<Footer />
				</>
			),
			children: [
				{
					index: true, // Redirect when "/movies" is accessed
					element: <Navigate to="3" replace />,
				},
				UserDashboard,
				ProfileRoute,
			],
		},
		{
			path: "/theaterowner",
			element: (
				<>
					<Header />
					<ProtectRoute roles={["TheaterOwner", "Admin"]}>
						<Outlet />
					</ProtectRoute>
					<Footer />
				</>
			),
			children: [
				{
					index: true, // Redirect when "/movies" is accessed
					element: <Navigate to="2" replace />,
				},
				OwnerDashboard,
				OwnerProfileRoute,
				AddMovieRoute,
			],
		},
		{
			path: "/admin",
			element: (
				<>
					<Header />
					<ProtectRoute roles={["Admin"]}>
						<Outlet />
					</ProtectRoute>
					<Footer />
				</>
			),
			children: [
				{
					index: true, // Redirect when "/movies" is accessed
					element: <Navigate to="1" replace />,
				},
				AdminDashboard,
				AdminProfileRoute,
				TheaterBookingRoute,
				MovieManagementRoute,
				TheaterManagementRoute,
				UserManagementRoute,
				TheaterOwnerManagementRoute,
				AddMovieRoute,
				ReviewRoutes,
				ManageReview,
			],
		},
		{
			path: "managereviews",
			element: (
				<>
					<Header />
					<Outlet />
					<Footer />
				</>
			),
			children: [IndividualReview],
		},
		{
			path: "owner",
			element: (
				<>
					<Header />
					<Outlet />
					<Footer />
				</>
			),
			children: [TheaterOwnerLoginRoute, TheaterOwnerSignUpRoute],
		},
		{
			path: "admin",
			element: (
				<>
					<Header />
					<Outlet />
					<Footer />
				</>
			),
			children: [AdminLoginRoute, AdminSignUpRoute],
		},
		{
			path: "/paymentsuccess",
			element: (
				<>
					<Header />
					<ProtectRoute roles={["Admin", "TheaterOwner", "User"]}>
						<PaymentSuccess />
					</ProtectRoute>
					<Footer />
				</>
			),
		},
		{
			path: "/paymentfailed",
			element: (
				<>
					<Header />
					<ProtectRoute roles={["Admin", "TheaterOwner", "User"]}>
						<PaymentFailed />
					</ProtectRoute>
					<Footer />
				</>
			),
		},

		{
			path: "*",
			element: (
				<>
					<Navigate to="/not-found" />
				</>
			),
		},
		{
			path: "/not-found",
			element: (
				<>
					<Header />
					<Error404 />
					<Footer />
				</>
			),
		},
	]);

	return router;
}

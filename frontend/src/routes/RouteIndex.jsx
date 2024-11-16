import {
	createBrowserRouter,
	Navigate,
	Outlet,
	RouterProvider,
} from "react-router-dom";

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
import { ManageReview, ReviewRoutes } from "./ReviewRoutes";
import { TheaterBookingRoute } from "./BookingRoutes";

export default function RouteIndex() {
	const router = createBrowserRouter([
		{
			path: "/",
			element: (
				<>
					<h1 className="text-center"> Movie Booking System Navigation</h1>
					<Outlet />
				</>
			),
			children: [
				UserLoginRoute,
				UserSignUpRoute,
				MovieRoutes,
				ShowRoutes,
				TheaterRoutes,
			],
		},
		{
			path: "/toauth",
			element: <Outlet />,
			children: [TheaterOwnerLoginRoute, TheaterOwnerSignUpRoute],
		},
		{
			path: "/adminauth",
			element: <Outlet />,
			children: [AdminLoginRoute, AdminSignUpRoute],
		},
		{
			path: "/user",
			element: (
				<>
					<Outlet />
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
					<Outlet />
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
					<Outlet />
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
			path: "owner",
			element: <Outlet />,
			children: [TheaterOwnerLoginRoute, TheaterOwnerSignUpRoute],
		},
		{
			path: "admin",
			element: <Outlet />,
			children: [AdminLoginRoute, AdminSignUpRoute],
		},
		{
			path: "*",
			element: <Navigate to="/not-found" />,
		},
		{
			path: "/not-found",
			element: <h1>Page not Found: 404</h1>,
		},
	]);

	return <RouterProvider router={router} />;
}

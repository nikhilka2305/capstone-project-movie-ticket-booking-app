import { Outlet } from "react-router-dom";
import { ManageReview, ReviewRoutes } from "./ReviewRoutes";
import { AddBooking, BookingRoute } from "./BookingRoutes";
import Profile from "../pages/shared/Profile";

export const UserDashboard = {
	path: ":userid",
	element: <Outlet />,
	children: [
		{
			index: true,
			element: <h3>User Dashboard</h3>,
		},
		ReviewRoutes,
		ManageReview,
		BookingRoute,
		AddBooking,
	],
};

export const ProfileRoute = {
	path: ":userid/profile",
	element: <Profile type="user" idtype="userid" />,
};

import { Outlet } from "react-router-dom";
import { ManageReview, ReviewRoutes } from "./ReviewRoutes";
import { BookingRoute } from "./BookingRoutes";
import Profile from "../pages/shared/Profile";
import UserDashboardComponent from "../pages/user/UserDashboardComponent";

export const UserDashboard = {
	path: ":userid",
	element: <Outlet />,
	children: [
		{
			index: true,
			element: <UserDashboardComponent />,
		},
		ReviewRoutes,
		ManageReview,
		BookingRoute,
	],
};

export const ProfileRoute = {
	path: ":userid/profile",
	element: <Profile type="user" idtype="userid" />,
};

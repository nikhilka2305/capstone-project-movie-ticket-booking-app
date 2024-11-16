import { Outlet } from "react-router-dom";
import { ManageReview, ReviewRoutes } from "./ReviewRoutes";
import { AddBooking, BookingRoute } from "./BookingRoutes";

export const UserDashboard = {
	path: ":userid",
	element: (
		<h3>
			User Dashboard
			<Outlet />
		</h3>
	),
	children: [ReviewRoutes, ManageReview, BookingRoute, AddBooking],
};

export const ProfileRoute = {
	path: ":userid/profile",
	element: <h3>User Profile</h3>,
};

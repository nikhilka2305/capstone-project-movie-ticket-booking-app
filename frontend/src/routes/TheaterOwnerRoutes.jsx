import { Outlet } from "react-router-dom";
// import { IndividualTheaterManagementRoute } from "./IndividualItemRoutes";
import { TheaterManagementRoute } from "./TheaterRoutes";
import { AddBooking, BookingRoute } from "./BookingRoutes";
import Profile from "../pages/shared/Profile";

export const OwnerDashboard = {
	path: ":ownerid",
	element: <Outlet />,
	children: [
		{
			index: true,
			element: <h2>Manage Theaters</h2>,
		},
		TheaterManagementRoute,
		BookingRoute,
		AddBooking,
	],
};

export const OwnerProfileRoute = {
	path: ":ownerid/profile",
	element: <Profile type="theaterowner" idtype="ownerid" />,
};

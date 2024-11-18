import { Outlet } from "react-router-dom";
// import { IndividualTheaterManagementRoute } from "./IndividualItemRoutes";
import { TheaterManagementRoute } from "./TheaterRoutes";
import { AddBooking, BookingRoute } from "./BookingRoutes";
import Profile from "../pages/shared/Profile";

export const OwnerDashboard = {
	path: ":ownerid",
	element: (
		<h3>
			Theater Owner Dashboard
			<Outlet />
		</h3>
	),
	children: [TheaterManagementRoute, BookingRoute, AddBooking],
};

export const OwnerProfileRoute = {
	path: ":ownerid/profile",
	element: <Profile type="theaterowner" idtype="ownerid" />,
};

import { Outlet } from "react-router-dom";
import { TheaterOwnerDashboardComponent } from "../pages/theaterOwner/TheaterOwnerDashboardComponent";
import { TheaterManagementRoute } from "./TheaterRoutes";
import { BookingRoute } from "./BookingRoutes";
import Profile from "../pages/shared/Profile";

export const OwnerDashboard = {
	path: ":ownerid",
	element: <Outlet />,
	children: [
		{
			index: true,
			element: <TheaterOwnerDashboardComponent />,
		},
		TheaterManagementRoute,
		BookingRoute,
	],
};

export const OwnerProfileRoute = {
	path: ":ownerid/profile",
	element: <Profile type="theaterowner" idtype="ownerid" />,
};

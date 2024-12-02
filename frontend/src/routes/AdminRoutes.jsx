import { Outlet } from "react-router-dom";
import { AddTheaterRoute, TheaterManagementRoute } from "./TheaterRoutes";
import { BookingRoute } from "./BookingRoutes";
import Profile from "../pages/shared/Profile";
import { AdminDashboardComponent } from "../pages/admin/AdminDashboardComponent";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageTheaterOwners from "../pages/admin/ManageTheaterOwners";

export const IndividualTheaterOwnerManagementRoute = {
	path: ":ownerid",
	element: <Profile type="theaterowner" idtype="ownerid" />,
};

export const IndividualUserManagementRoute = {
	path: ":userid",
	element: <Profile type="user" idtype="userid" />,
};

export const AdminDashboard = {
	path: ":adminid",
	element: <Outlet />,
	children: [
		{
			index: true,
			element: <AdminDashboardComponent />,
		},
		TheaterManagementRoute,
		AddTheaterRoute,
		BookingRoute,
	],
};
export const AdminProfileRoute = {
	path: ":adminid/profile",
	element: <Profile type="admin" idtype="adminid" />,
};

export const AdminTheaterBookings = {
	path: "theaterbookings",
	element: <h3>Admin Theater Bookings</h3>,
};

export const UserManagementRoute = {
	path: "manageusers",
	element: <Outlet />,
	children: [
		{
			index: true,
			element: <ManageUsers />,
		},
		IndividualUserManagementRoute,
	],
};
export const TheaterOwnerManagementRoute = {
	path: "managetheaterowners",
	element: <Outlet />,
	children: [
		{
			index: true,
			element: <ManageTheaterOwners />,
		},
		IndividualTheaterOwnerManagementRoute,
	],
};

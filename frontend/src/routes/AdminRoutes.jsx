import { Outlet } from "react-router-dom";
import { TheaterManagementRoute } from "./TheaterRoutes";
import { AddBooking, BookingRoute } from "./BookingRoutes";

export const IndividualTheaterOwnerManagementRoute = {
	path: ":ownerid",
	element: <h2>Manage Individual Theater Owner Id</h2>,
};

export const IndividualUserManagementRoute = {
	path: ":userid",
	element: <h2>Manage Individual User Id</h2>,
};

export const AdminDashboard = {
	path: ":adminid",
	element: (
		<h3>
			Admin Dashboard of 1<Outlet />
		</h3>
	),
	children: [TheaterManagementRoute, BookingRoute, AddBooking],
};
export const AdminProfileRoute = {
	path: ":adminid/profile",
	element: <h3>Admin Profile</h3>,
};

export const AdminTheaterBookings = {
	path: "theaterbookings",
	element: <h3>Admin Theater Bookings</h3>,
};

export const UserManagementRoute = {
	path: "manageusers",
	element: (
		<h3>
			Manage Users
			<Outlet />
		</h3>
	),
	children: [IndividualUserManagementRoute],
};
export const TheaterOwnerManagementRoute = {
	path: "managetheaterowners",
	element: (
		<h3>
			Manage Theater Owners
			<Outlet />
		</h3>
	),
	children: [IndividualTheaterOwnerManagementRoute],
};

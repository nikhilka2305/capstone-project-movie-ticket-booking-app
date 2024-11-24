import { Outlet } from "react-router-dom";
import Bookings from "../pages/shared/Bookings";
import SingleBooking from "../pages/shared/SingleBooking";

export const ManageBooking = {
	path: "manage",
	element: (
		<h4>
			Manage Booking
			<Outlet />
		</h4>
	),
};
export const IndividualBooking = {
	path: ":bookingid",
	element: <Outlet />,
	children: [
		{
			index: true,
			element: <SingleBooking />,
		},
		ManageBooking,
	],
};
export const BookingRoute = {
	path: "bookings",
	element: <Outlet />,
	children: [
		{
			index: true,
			element: <Bookings />,
		},
		IndividualBooking,
	],
};

export const TheaterBookingRoute = {
	path: "theaterbookings",
	element: (
		<h4>
			All/Filtered Theater Bookings
			<Outlet />
		</h4>
	),
	children: [IndividualBooking],
};

export const AddBooking = {
	path: "addBooking",
	element: <h4>Book Your Seats</h4>,
};

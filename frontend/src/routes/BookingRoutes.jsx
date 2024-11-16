import { Outlet } from "react-router-dom";

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
	element: (
		<h4>
			Individual Booking
			<Outlet />
		</h4>
	),
	children: [ManageBooking],
};
export const BookingRoute = {
	path: "bookings",
	element: (
		<h4>
			All/Filtered Booking
			<Outlet />
		</h4>
	),
	children: [IndividualBooking],
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

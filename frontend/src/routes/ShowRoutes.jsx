import { Outlet } from "react-router-dom";
import Shows from "../pages/shared/Shows";
import SingleShow from "../pages/shared/SingleShow";
import AddShow from "../pages/shared/AddShow";
import { AddBookingRoute } from "./BookingRoutes";
import ManageShows from "../pages/shared/ManageShows";

export const IndividualShow = {
	path: ":showid",
	element: <Outlet />,
	children: [
		{
			index: true,
			element: <SingleShow />,
		},
		AddBookingRoute,
	],
};

export const ShowRoutes = {
	path: "shows",
	element: <Outlet />,
	children: [
		{
			index: true,
			element: <Shows />,
		},
		IndividualShow,
	],
};
export const ManageShow = {
	path: ":showid/manage",
	element: <h2>Edit Show</h2>,
};
export const ManageShowRoutes = {
	path: "manageshows",
	element: <Outlet />,
	children: [
		{
			index: true,
			element: <ManageShows />,
		},
		ManageShow,
	],
};

export const AddTheaterShow = {
	path: "addshow",
	element: <AddShow />,
};

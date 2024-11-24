import { Outlet } from "react-router-dom";
import Shows from "../pages/shared/Shows";
import SingleShow from "../pages/shared/SingleShow";
import AddShow from "../pages/shared/AddShow";
import { AddBookingRoute } from "./BookingRoutes";

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

export const AddTheaterShow = {
	path: "addshow",
	element: <AddShow />,
};

export const ManageShow = {
	path: "shows/:showid/manage",
	element: <h2>Edit Show</h2>,
};

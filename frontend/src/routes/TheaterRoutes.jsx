import { Outlet } from "react-router-dom";
import { AddShow, IndividualShow, ManageShow, ShowRoutes } from "./ShowRoutes";
import { AddReview, ReviewRoutes } from "./ReviewRoutes";
import Theaters from "../pages/shared/Theaters";
import SingleTheater from "../pages/shared/SingleTheater";
import AddTheater from "../pages/shared/AddTheater";

export const IndividualTheater = {
	path: ":theaterid",
	element: <Outlet />,
	children: [
		{
			index: true,
			element: <SingleTheater />,
		},
		ReviewRoutes,
		AddReview,
	],
};

export const AddTheaterRoute = {
	path: "addtheater",
	element: <AddTheater />,
};

export const IndividualTheaterManagementRoute = {
	path: ":theaterid",
	element: (
		<h2>
			Manage Individual Theater Id
			<Outlet />
		</h2>
	),
	children: [AddShow, ShowRoutes, IndividualShow, ManageShow],
};

export const TheaterManagementRoute = {
	path: "managetheaters",
	element: <Outlet />,
	children: [
		{
			index: true,
			element: <h1>Dashboard</h1>,
		},
		IndividualTheaterManagementRoute,
		AddTheaterRoute,
	],
};

export const TheaterRoutes = {
	path: "theaters",
	element: <Outlet />,
	children: [
		{
			index: true,
			element: <Theaters />,
		},
		IndividualTheater,
	],
};

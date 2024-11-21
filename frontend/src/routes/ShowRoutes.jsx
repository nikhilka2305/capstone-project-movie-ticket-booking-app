import { Outlet } from "react-router-dom";
import Shows from "../pages/shared/Shows";

export const IndividualShow = {
	path: ":showid",
	element: <h2>Show ID</h2>,
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

export const AddShow = {
	path: "addshow",
	element: <h2>Add Show</h2>,
};

export const ManageShow = {
	path: "shows/:showid/manage",
	element: <h2>Edit Show</h2>,
};

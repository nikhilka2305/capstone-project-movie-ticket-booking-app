import { Outlet } from "react-router-dom";
import { AddShow, IndividualShow, ManageShow, ShowRoutes } from "./ShowRoutes";
import { ReviewRoutes } from "./ReviewRoutes";

export const IndividualTheater = {
	path: ":theaterid",
	element: (
		<p>
			See Individual Theater
			<Outlet />
		</p>
	),
	children: [ReviewRoutes],
};

export const AddTheaterRoute = {
	path: "addtheater",
	element: <h3>Add Theater</h3>,
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
	element: (
		<h3>
			Manage Theaters
			<Outlet />
		</h3>
	),
	children: [IndividualTheaterManagementRoute, AddTheaterRoute],
};

export const TheaterRoutes = {
	path: "theaters",
	element: (
		<h2>
			Browse Currently Running
			<Outlet />
		</h2>
	),
	children: [IndividualTheater],
};

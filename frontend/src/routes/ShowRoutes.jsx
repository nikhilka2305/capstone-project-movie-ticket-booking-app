import { Outlet } from "react-router-dom";

export const IndividualShow = {
	path: ":showid",
	element: <h2>Show ID</h2>,
};

export const ShowRoutes = {
	path: "shows",
	element: (
		<h2>
			Browse Currently Running Shows
			<Outlet />
		</h2>
	),
	children: [IndividualShow],
};

export const AddShow = {
	path: "addshow",
	element: <h2>Add Show</h2>,
};

export const ManageShow = {
	path: "shows/:showid/manage",
	element: <h2>Edit Show</h2>,
};

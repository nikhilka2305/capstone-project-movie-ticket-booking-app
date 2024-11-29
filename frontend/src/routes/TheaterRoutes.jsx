import { Outlet } from "react-router-dom";
import {
	AddTheaterShow,
	IndividualShow,
	ManageShow,
	ShowRoutes,
} from "./ShowRoutes";
import { AddReviewRoute, ReviewRoutes } from "./ReviewRoutes";
import Theaters from "../pages/shared/Theaters";
import SingleTheater from "../pages/shared/SingleTheater";
import SeatManagement from "../pages/shared/SeatManagement";
import AddTheater from "../pages/shared/AddTheater";
import ProtectRoute from "../hooks/ProtectRoute";
import ManageTheaters from "../pages/shared/ManageTheaters";

export const SeatManagementRoute = {
	path: "seatmanagement",
	element: <SeatManagement />,
};

export const IndividualTheaterManagementRoute = {
	path: "manage",
	element: (
		<ProtectRoute roles={["TheaterOwner", "Admin"]}>
			<Outlet />
		</ProtectRoute>
	),
	children: [
		{ index: true, element: <h2>Theater Management - Individual</h2> },
		SeatManagementRoute,
	],
};

export const AddTheaterRoute = {
	path: "addtheater",
	element: <AddTheater />,
};
export const TheaterManagementRoute = {
	path: "managetheaters",
	element: <Outlet />,
	children: [{ index: true, element: <ManageTheaters /> }, AddTheaterRoute],
};

export const IndividualTheater = {
	path: ":theaterid",
	element: <Outlet />,
	children: [
		{
			index: true,
			element: <SingleTheater />,
		},
		AddTheaterShow,
		ManageShow,
		ShowRoutes,
		IndividualShow,
		ReviewRoutes,
		AddReviewRoute,
		IndividualTheaterManagementRoute,
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
		TheaterManagementRoute,
		IndividualTheater,
	],
};

import { Outlet } from "react-router-dom";
import { AddReviewRoute, ReviewRoutes } from "./ReviewRoutes";
import Movies from "../pages/shared/Movies";
import SingleMovie from "../pages/shared/SingleMovie";
import AddMovie from "../pages/shared/AddMovie";
import ProtectRoute from "../hooks/ProtectRoute";
import { ShowRoutes } from "./ShowRoutes";
import ManageMovies from "../pages/admin/ManageMovies";

export const AddMovieRoute = {
	path: "addmovie",
	element: (
		<ProtectRoute roles={["TheaterOwner", "Admin"]}>
			<AddMovie />
		</ProtectRoute>
	),
};

export const IndividualMovieManagementRoute = {
	path: ":movieid",
	element: <h2>Manage Individual Movie Id</h2>,
};

export const MovieManagementRoute = {
	path: "managemovies",
	element: <Outlet />,
	children: [
		{
			index: true,
			element: (
				<ProtectRoute roles={["Admin"]}>
					<ManageMovies />
				</ProtectRoute>
			),
		},
		IndividualMovieManagementRoute,
	],
};
export const IndividualMovie = {
	path: ":movieid",
	element: <Outlet />,
	children: [
		{
			index: true,
			element: <SingleMovie />,
		},
		ReviewRoutes,
		AddReviewRoute,
		ShowRoutes,
	],
};

export const MovieRoutes = {
	path: "movies",
	element: <Outlet />,
	children: [
		{
			index: true,
			element: <Movies />,
		},
		MovieManagementRoute,
		IndividualMovie,
		AddMovieRoute,
	],
};

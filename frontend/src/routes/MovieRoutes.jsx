import { Outlet } from "react-router-dom";
import { AddReview, ReviewRoutes } from "./ReviewRoutes";
import Movies from "../pages/shared/Movies";
import SingleMovie from "../pages/shared/SingleMovie";
import AddMovie from "../pages/shared/AddMovie";

export const IndividualMovie = {
	path: ":movieid",
	element: <Outlet />,
	children: [
		{
			index: true,
			element: <SingleMovie />,
		},
		ReviewRoutes,
		AddReview,
	],
};

export const IndividualMovieManagementRoute = {
	path: ":movieid",
	element: <h2>Manage Individual Movie Id</h2>,
};

export const MovieManagementRoute = {
	path: "managemovies",
	element: (
		<h3>
			Manage Movies
			<Outlet />
		</h3>
	),
	children: [IndividualMovieManagementRoute],
};

export const AddMovieRoute = {
	path: "addmovie",
	element: <AddMovie />,
};

export const MovieRoutes = {
	path: "movies",
	element: <Outlet />,
	children: [
		{
			index: true,
			element: <Movies />,
		},
		IndividualMovie,
	],
};

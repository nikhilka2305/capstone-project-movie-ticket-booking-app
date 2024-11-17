import { Outlet } from "react-router-dom";
import { AddReview, ReviewRoutes } from "./ReviewRoutes";

export const IndividualMovie = {
	path: ":movieid",
	element: (
		<p>
			See Individual Movie
			<Outlet />
		</p>
	),
	children: [ReviewRoutes, AddReview],
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
	element: <h3>Add Movie</h3>,
};

export const MovieRoutes = {
	path: "movies",
	element: (
		<h2>
			Browse Currently Running
			<Outlet />
		</h2>
	),
	children: [IndividualMovie],
};

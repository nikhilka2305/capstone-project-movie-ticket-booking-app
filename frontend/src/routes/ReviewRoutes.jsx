import { Outlet } from "react-router-dom";

export const ManageReview = {
	path: "reviews/:reviewid/manage",
	element: <h3>Edit Review</h3>,
};
export const IndividualReview = {
	path: ":reviewid",
	element: <h3>Individual review</h3>,
};

export const ReviewRoutes = {
	path: "reviews",
	element: (
		<h3>
			Reviews <Outlet />
		</h3>
	),
	children: [IndividualReview],
};

export const AddReview = {
	path: "Add review",
	element: <h3>Reviews</h3>,
};

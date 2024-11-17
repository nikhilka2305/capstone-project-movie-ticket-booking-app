import { Outlet } from "react-router-dom";
import ProtectRoute from "../hooks/ProtectRoute";

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
	path: "addreview",
	element: (
		<ProtectRoute roles={["User"]}>
			<h3>Add Reviews</h3>
		</ProtectRoute>
	),
};

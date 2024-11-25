import { Outlet } from "react-router-dom";
import ProtectRoute from "../hooks/ProtectRoute";
import Reviews from "../pages/shared/Reviews";
import EditSingleReview from "../pages/shared/EditSingleReview";
import AddReview from "../pages/shared/AddReview";

export const ManageReview = {
	path: "reviews/:reviewid/manage",
	element: <h3>Edit Review</h3>,
};
export const IndividualReview = {
	path: ":reviewid",
	element: <EditSingleReview />,
};

export const AddReviewRoute = {
	path: "addreview",
	element: (
		<ProtectRoute roles={["User"]}>
			<AddReview />
		</ProtectRoute>
	),
};

export const ReviewRoutes = {
	path: "reviews",
	element: <Outlet />,
	children: [
		{
			index: true,
			element: <Reviews />,
		},
		AddReviewRoute,
	],
};

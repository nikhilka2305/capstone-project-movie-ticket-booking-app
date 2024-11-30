import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import PropTypes from "prop-types";

const ProtectRoute = ({ children, roles = [] }) => {
	const auth = useContext(AuthContext);

	const params = {
		User: "user",
		TheaterOwner: "theaterowner",
		Admin: "admin",
	};

	if (!auth.isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	if (roles.length && !roles.includes(auth.user?.role)) {
		return (
			<Navigate
				to={`/${params[auth.user?.role]}/${auth.user.loggedUserId}`}
				replace
			/>
		);
	}

	return children;
};
ProtectRoute.propTypes = {
	children: PropTypes.any,
	roles: PropTypes.array,
};
export default ProtectRoute;

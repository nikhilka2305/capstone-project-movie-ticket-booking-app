import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectRoute = ({ children, roles = [] }) => {
	const auth = useContext(AuthContext);

	console.log(auth.isAuthenticated);
	console.log(auth.user);

	if (!auth.isAuthenticated) {
		console.log("Need to Login");
		return <Navigate to="/login" replace />;
	} else console.log("Authenticated");

	if (roles.length && !roles.includes(auth.user?.role)) {
		console.log(auth.user.role, roles[0], !roles.includes(auth.user?.role));
		return <Navigate to={"/not-found"} replace />;
	}

	return children;
};

export default ProtectRoute;

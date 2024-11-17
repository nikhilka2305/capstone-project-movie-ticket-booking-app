import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectRoute = ({ children, roles = [] }) => {
	const auth = useAuth();
	console.log(auth);

	if (!auth || !auth.isAuthenticated) {
		console.log("Not authed");
		return <Navigate to="/login" replace />;
	} else console.log("Authenticated");

	if (roles.length && !roles.includes(auth.user?.role)) {
		console.log(auth.user.role, roles[0], !roles.includes(auth.user?.role));
		return <Navigate to={"/not-found"} replace />;
	}

	return children;
};

export default ProtectRoute;

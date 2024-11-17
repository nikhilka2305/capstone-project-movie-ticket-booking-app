import { useAuth } from "../context/AuthContext";

const RouteProtect = ({ children }) => {
	const auth = useAuth();
	console.log("RouteProtect Auth Context:", auth, ...children);

	if (!auth || !auth.isAuthenticated) {
		console.log("Not authed");

		// return <Navigate to="/login" replace />;
	} else console.log("Authenticated");

	return children;
};

export default RouteProtect;

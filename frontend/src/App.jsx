import { RouterProvider } from "react-router-dom";
import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { AuthContext } from "./context/AuthContext";
import RouteIndex from "./routes/RouteIndex";
import { useContext, useEffect } from "react";

function App() {
	const { isAuthenticated, user, logOut } = useContext(AuthContext);
	useEffect(() => {}, [isAuthenticated, user]);
	return (
		<>
			<AuthProvider>
				<Toaster />
				<RouterProvider router={RouteIndex()} />
			</AuthProvider>
		</>
	);
}

export default App;

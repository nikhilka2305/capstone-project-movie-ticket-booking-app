import { RouterProvider } from "react-router-dom";
import "./App.css";

import { AuthContext, AuthProvider } from "./context/AuthContext";

import RouteIndex from "./routes/RouteIndex";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
	// const [user, setUser] = useState({
	// 	isAuthenticated: false,
	// 	user: null,
	// 	loading: true,
	// });
	// axios.defaults.withCredentials = true;
	// const serverUrl1 = `${import.meta.env.VITE_SERVER_BASE_URL}/check-user`;
	// useEffect(() => {
	// 	const checkUser = async () => {
	// 		try {
	// 			const isAuth = await axios.get(serverUrl1);
	// 			console.log(isAuth);
	// 			if (isAuth.statusText === "OK" && isAuth.data.user) {
	// 				const userData = isAuth.data.user;
	// 				console.log(userData);
	// 				setUser({ isAuthenticated: true, user: userData, loading: false });
	// 			} else {
	// 				setUser({ isAuthenticated: false, user: null, loading: false });
	// 			}
	// 		} catch (err) {
	// 			console.log(err);
	// 			setUser({ isAuthenticated: false, user: null, loading: false });
	// 		}
	// 	};
	// 	checkUser();
	// }, []);

	// const handleLogOut = () => {
	// 	console.log("Logging Out");
	// };
	// setUser();

	return (
		<>
			<AuthProvider>
				<RouterProvider router={RouteIndex()} />
			</AuthProvider>
		</>
	);
}

export default App;

import { RouterProvider } from "react-router-dom";
import "./App.css";

import { AuthProvider } from "./context/AuthContext";

import RouteIndex from "./routes/RouteIndex";

function App() {
	return (
		<>
			<AuthProvider>
				<RouterProvider router={RouteIndex()} />
			</AuthProvider>
		</>
	);
}

export default App;

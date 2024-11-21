import { RouterProvider } from "react-router-dom";
import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

import RouteIndex from "./routes/RouteIndex";

function App() {
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

import "./App.css";
import Footer from "./components/shared/Footer";
import Header from "./components/shared/Header";
import { AuthContext } from "./context/AuthContext";

import RouteIndex from "./routes/RouteIndex";

function App() {
	return (
		<>
			<AuthContext.Provider
				value={{
					isAuthenticated: true,
					user: {
						username: "NiksUser",
						role: "TheaterOwner",
					},
				}}
			>
				<Header />

				<RouteIndex />
				<Footer />
			</AuthContext.Provider>
		</>
	);
}

export default App;

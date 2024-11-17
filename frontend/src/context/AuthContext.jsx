import { createContext, useContext } from "react";

// use State to update user

export const AuthContext = createContext({
	isAuthenticated: false,
	user: {
		username: "NiksUser",
		role: "User",
	},
});

export const useAuth = () => useContext(AuthContext);

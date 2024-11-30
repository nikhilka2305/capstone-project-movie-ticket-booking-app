import { createContext, useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;
export const AuthContext = createContext({
	auth: {
		isAuthenticated: false,
		user: {
			loggedUserId: "",
			loggedUserName: "",
			loggedUserObjectId: "",
			role: "",
		},
		loading: true,
	},
	logOn: () => {},
	logOut: () => {},
	checkAuth: () => {},
});

export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState({
		isAuthenticated: false,
		user: {
			loggedUserId: "",
			loggedUserName: "",
			loggedUserObjectId: "",
			role: "",
		},
		loading: true,
	});

	const serverBaseUrl = `${import.meta.env.VITE_SERVER_BASE_URL}`;
	const checkAuth = async () => {
		try {
			const response = await axios.get(`${serverBaseUrl}/check-user`);
			console.log(response);
			if (response.statusText === "OK" && response.data.user) {
				const userData = response.data.user;
				console.log(userData);
				setAuth({ isAuthenticated: true, user: userData, loading: false });
				console.log("checkAuth response data:", response.data);
			} else {
				console.log("Auth Failed??");
				setAuth({
					isAuthenticated: false,
					user: {
						loggedUserId: "",
						loggedUserName: "",
						loggedUserObjectId: "",
						role: "",
					},
					loading: false,
				});
			}
		} catch (err) {
			console.log("Some other issue");
			console.log(err);
			setAuth({
				isAuthenticated: false,
				user: {
					loggedUserId: "",
					loggedUserName: "",
					loggedUserObjectId: "",
					role: "",
				},
				loading: false,
			});
		}
	};

	const login = (userData) => {
		setAuth({
			isAuthenticated: true,
			user: userData,
			loading: false,
		});
	};

	const logOut = async () => {
		try {
			await axios.post(
				`${serverBaseUrl}/logout`,
				{},
				{ withCredentials: true }
			);
			setAuth({
				isAuthenticated: false,
				user: {
					loggedUserId: "",
					loggedUserName: "",
					loggedUserObjectId: "",
					role: "",
				},
				loading: false,
			});
			console.log("Auth state after logout:", {
				isAuthenticated: false,
				user: null,
			});
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		checkAuth();
	}, []);
	useEffect(() => {
		console.log("AuthProvider context state:", auth);
	}, [auth]);

	return (
		<AuthContext.Provider
			value={{ ...auth, setAuth, login, logOut, checkAuth }}
		>
			{!auth.loading && children}
		</AuthContext.Provider>
	);
};

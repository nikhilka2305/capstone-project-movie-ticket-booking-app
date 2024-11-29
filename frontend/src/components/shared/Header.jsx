import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect } from "react";
import ThemeToggler from "./ThemeToggler";
import toast from "react-hot-toast";

export default function Header() {
	const { isAuthenticated, user, logOut } = useContext(AuthContext);
	console.log("Header received context:", { isAuthenticated, user });
	useEffect(() => {
		console.log("Header updated:", { isAuthenticated, user });
	}, [isAuthenticated, user]);
	const navigate = useNavigate();
	const handleLogOut = () => {
		logOut();
		toast.success("Succesfully Logged Out");
		navigate("/");
	};
	const params = {
		User: "user",
		TheaterOwner: "theaterowner",
		Admin: "admin",
	};

	return (
		// <header
		// 	className="flex justify-between items-center border-b border-slate-500 dark:border-slate-100 px-16 py-2 h-36
		// "
		// >
		<header className="px-4">
			<div className="navbar bg-base- flex gap-4">
				<div className="flex-none">
					<div className="dropdown">
						<div
							tabIndex={0}
							role="button"
							className="btn btn-ghost btn-circle"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M4 6h16M4 12h16M4 18h7"
								/>
							</svg>
						</div>
						<ul
							tabIndex={0}
							className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
						>
							<li>
								<Link to={"/"}>Home</Link>
							</li>
							<li>
								<Link to={"/movies"}>Movies</Link>
							</li>
							<li>
								<Link to={"/theaters"}>Theaters</Link>
							</li>
							<li>
								<Link to={"/shows"}>Shows</Link>
							</li>
							<li>
								<a>About</a>
							</li>
						</ul>
					</div>
				</div>
				<div className="flex-1 gap-4">
					<Link to={"/"} className="btn btn-ghost text-xl">
						MBS
					</Link>

					{!isAuthenticated && <Link to="/login">Login</Link>}
					{isAuthenticated && <button onClick={handleLogOut}>LogOut</button>}
				</div>
				<div className="flex gap-4 before:first:">
					{isAuthenticated && user && (
						<Link to={`/${params[user.role]}/${user.loggedUserId}/`}>
							<p>{user.role}</p>
						</Link>
					)}
					{isAuthenticated && user && (
						<Link to={`/${params[user.role]}/${user.loggedUserId}/profile`}>
							<p>{user.loggedUserName}</p>
						</Link>
					)}
					<ThemeToggler />
				</div>
			</div>
		</header>
	);
}

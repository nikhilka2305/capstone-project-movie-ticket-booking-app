import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import ThemeToggler from "./ThemeToggler";

export default function Header() {
	const { isAuthenticated, user, logOut } = useContext(AuthContext);
	const navigate = useNavigate();
	const handleLogOut = () => {
		logOut();
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
		<header>
			<div className="navbar bg-base-100">
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
								<a>Homepage</a>
							</li>
							<li>
								<a>Movies</a>
							</li>
							<li>
								<a>Theaters</a>
							</li>
							<li>
								<a>Shows</a>
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
					<Link to={"/movies"}>Movies</Link>
					<Link to={"/theaters"}>Theaters</Link>
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
					<button className="btn btn-square btn-ghost">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							className="inline-block h-5 w-5 stroke-current"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
							></path>
						</svg>
					</button>
				</div>
			</div>
		</header>
		// 	<section className="logo">
		// 		<h2 className="text-2xl">
		// 			<Link to="/">MBS</Link>
		// 		</h2>
		// 	</section>
		// 	<aside className="flex gap-8">

		// 	</aside>
		// 	<section className="loggedUser">
		//

		// 	</section>
		// </header>
	);
}

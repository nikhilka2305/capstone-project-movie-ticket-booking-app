import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import ThemeToggler from "./ThemeToggler";
import toast from "react-hot-toast";

export default function Header() {
	const { isAuthenticated, user, logOut } = useContext(AuthContext);

	const [displayImage, setDisplayImage] = useState("");

	useEffect(() => {
		if (!isAuthenticated)
			setDisplayImage(
				"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
			);
		else
			setDisplayImage(
				"https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png"
			);
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
								<Link to={"/login"}>User Login</Link>
							</li>
							<li>
								<Link to={"/toauth/tologin"}>Theater Owner Login</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className="flex-1 gap-4">
					<Link to={"/"} className="btn btn-ghost text-xl">
						MBS
					</Link>
				</div>
				<div className="flex gap-4 before:first:">
					{isAuthenticated && user && <p>{user.loggedUserName}</p>}
					<ThemeToggler />
					<div className="dropdown dropdown-end">
						<div
							tabIndex={0}
							role="button"
							className="btn btn-ghost btn-circle avatar"
						>
							<div className="w-10 rounded-full">
								<img alt="Tailwind CSS Navbar component" src={displayImage} />
							</div>
						</div>
						<ul
							tabIndex={0}
							className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
						>
							{isAuthenticated && user && (
								<li>
									<Link
										to={`/${params[user.role]}/${user.loggedUserId}/profile`}
										className="justify-between"
									>
										{user.loggedUserName} Profile
									</Link>
								</li>
							)}

							{isAuthenticated && user && (
								<li>
									<Link
										to={`/${params[user.role]}/${user.loggedUserId}/`}
										className="justify-between"
									>
										{user.role} Dashboard
									</Link>
								</li>
							)}
							<li>
								<a>Settings</a>
							</li>
							<li>{!isAuthenticated && <Link to="/login">Login</Link>}</li>

							{isAuthenticated && (
								<li>
									<button onClick={handleLogOut}>LogOut</button>
								</li>
							)}
						</ul>
					</div>
				</div>
			</div>
		</header>
	);
}

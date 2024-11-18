// import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

export default function Header() {
	const { isAuthenticated, user, logOut } = useContext(AuthContext);

	return (
		<header className="flex justify-between items-center border-b border-slate-500 dark:border-slate-100 px-16 py-2 ">
			<section className="logo">
				<h2 className="text-2xl">
					<Link to="/">LOGO</Link>
				</h2>
			</section>
			<aside>
				{!isAuthenticated && <Link to="/login">Login</Link>}
				{isAuthenticated && (
					<button className="ml-8" onClick={logOut}>
						LogOut
					</button>
				)}
			</aside>
			<section className="loggedUser">
				{isAuthenticated && user && <p>{user.loggedUserName}</p>}

				{isAuthenticated && user && <p>{user.role}</p>}
			</section>
		</header>
	);
}

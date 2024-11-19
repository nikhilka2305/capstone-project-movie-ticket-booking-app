import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

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
		<header
			className="flex justify-between items-center border-b border-slate-500 dark:border-slate-100 px-16 py-2 h-36
		"
		>
			<section className="logo">
				<h2 className="text-2xl">
					<Link to="/">MBS</Link>
				</h2>
			</section>
			<aside className="flex gap-8">
				<Link to={"/movies"}>Movies</Link>
				<Link to={"/theaters"}>Theaters</Link>
				{!isAuthenticated && <Link to="/login">Login</Link>}
				{isAuthenticated && <button onClick={handleLogOut}>LogOut</button>}
			</aside>
			<section className="loggedUser">
				{isAuthenticated && user && (
					<Link to={`/${params[user.role]}/${user.loggedUserId}/profile`}>
						<p>{user.loggedUserName}</p>
					</Link>
				)}

				{isAuthenticated && user && (
					<Link to={`/${params[user.role]}/${user.loggedUserId}/`}>
						<p>{user.role}</p>
					</Link>
				)}
			</section>
		</header>
	);
}

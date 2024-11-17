// import { AuthContext } from "../../context/AuthContext";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
	const sample = useAuth();
	console.log(sample);

	return (
		<header className="flex justify-between items-center border-b border-slate-500 dark:border-slate-100 px-16 py-2 ">
			<section className="logo">
				<h2 className="text-2xl">LOGO</h2>
			</section>
			<section className="loggedUser">
				<h2>{sample.isAuthenticated.toString()}</h2>
				<p>{sample.user.username}</p>
				<p>{sample.user.role}</p>
			</section>
		</header>
	);
}

import { useContext, useEffect, useState } from "react";

import { Pagination } from "../../components/shared/Pagination";

import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import BookingCard from "../../components/shared/formcomponents/BookingCard";
import toast from "react-hot-toast";
import axios from "axios";

export default function ManageUsers() {
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const [page, setPage] = useState(1); // Current page
	const [totalPages, setTotalPages] = useState(1);
	const { user } = useContext(AuthContext);
	const [users, setUsers] = useState([]);
	useEffect(() => {
		setLoading(true);
		async function getMovies() {
			if (user.role !== "Admin") navigate("/");
			try {
				const serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}/user`;
				const response = await axios.get(`${serverUrl}`, {
					params: { page, limit: 8 },
				});
				const responseData = response.data;

				setUsers(responseData.users);
				setTotalPages(responseData.totalPages);
				setLoading(false);
			} catch (err) {
				toast.error("Unable to fetch users");
			}
		}

		getMovies();
		setLoading(false);
	}, [page, navigate, user]);
	return (
		<main className="py-8 px-8 min-h-svh w-full flex flex-col justify-center items-center">
			<h1 className="text-2xl mb-lg-2 my-4 text-center">Manage Users</h1>
			<div className="flex flex-col gap-4 md:flex-row md:flex-wrap items-center justify-between w-full">
				{loading && (
					<div className="flex w-52 flex-col gap-4">
						<div className="skeleton h-32 w-full"></div>
						<div className="skeleton h-4 w-28"></div>
						<div className="skeleton h-4 w-full"></div>
						<div className="skeleton h-4 w-full"></div>
					</div>
				)}
				{users.length === 0 && (
					<h2 className="text-2xl text-center mt-8 mx-auto">No Users</h2>
				)}
				{users.map((item, i) => (
					<BookingCard
						key={i}
						image={item?.displayImage}
						title={item?.username}
					>
						<Link
							key={i}
							to={`./${item?.userId}`}
							className="w-full md:w-2/5 lg:w-1/3 xl:w-1/4"
						>
							Edit Profile
						</Link>
						<Link
							to={`/user/${item?.userId}`}
							className="w-full md:w-2/5 lg:w-1/3 xl:w-1/4"
						>
							<p>User Dashboard</p>
						</Link>
					</BookingCard>
				))}
			</div>
			<Pagination page={page} setPage={setPage} totalPages={totalPages} />
		</main>
	);
}

import { useContext, useEffect, useState } from "react";

import { Pagination } from "../../components/shared/Pagination";

import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import BookingCard from "../../components/shared/formcomponents/BookingCard";

import toast from "react-hot-toast";
import axios from "axios";
import Skeleton from "../../components/shared/Skeleton";

export default function ManageTheaterOwners() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1); // Current page
	const [totalPages, setTotalPages] = useState(1);
	const { user } = useContext(AuthContext);
	const [theaterOwners, setTheaterOwners] = useState([]);
	useEffect(() => {
		setLoading(true);
		async function getMovies() {
			if (user.role !== "Admin") navigate("/");
			try {
				const serverUrl = `${
					import.meta.env.VITE_SERVER_BASE_URL
				}/theaterowner`;
				const response = await axios.get(`${serverUrl}`, {
					params: { page, limit: 8 },
				});
				const responseData = response.data;

				setTheaterOwners(responseData.owners);
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
			<Link to={`/admin/${user.loggedUserId}`}>Go Back</Link>
			<h1 className="text-2xl mb-lg-2 my-4 text-center">
				Manage Theater Owners
			</h1>
			<div className="flex flex-col gap-4 md:flex-row md:flex-wrap items-center justify-between w-full">
				{loading && <Skeleton />}
				{!loading && (
					<>
						{theaterOwners.length === 0 && (
							<h2 className="text-2xl text-center mt-8 mx-auto">
								No Theater Owners
							</h2>
						)}
						{theaterOwners.map((item, i) => (
							<BookingCard
								key={i}
								image={item?.displayImage}
								title={item?.username}
							>
								<Link
									to={`./${item?.userId}`}
									className="w-full md:w-2/5 lg:w-1/3 xl:w-1/4"
								>
									<p>Edit Profile</p>
								</Link>
								<Link
									to={`/theaterowner/${item?.userId}`}
									className="w-full md:w-2/5 lg:w-1/3 xl:w-1/4"
								>
									<p>Owner Dashboard</p>
								</Link>
							</BookingCard>
						))}
					</>
				)}
			</div>
			<Pagination page={page} setPage={setPage} totalPages={totalPages} />
		</main>
	);
}

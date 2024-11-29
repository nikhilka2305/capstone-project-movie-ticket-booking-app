import { useContext, useEffect, useState } from "react";

import { Pagination } from "../../components/shared/Pagination";

import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import BookingCard from "../../components/shared/formcomponents/BookingCard";

export default function ManageUsers() {
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1); // Current page
	const [totalPages, setTotalPages] = useState(1);
	const { user } = useContext(AuthContext);
	const [users, setUsers] = useState([]);
	return (
		<main className="py-8 px-8 flex flex-col items-center  min-h-svh w-full">
			<h1 className="text-2xl mb-lg-2 my-4">Manage Users</h1>
			{loading && <div>Loading...</div>}
			{users.map((item, i) => (
				<Link key={i} to={`./${item?.userId}`}>
					<BookingCard
						// image={item?.images[0]}
						title={item?.username}
					></BookingCard>
				</Link>
			))}

			<Pagination page={page} setPage={setPage} totalPages={totalPages} />
		</main>
	);
}

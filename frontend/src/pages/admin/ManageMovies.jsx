import { useContext, useEffect, useState } from "react";

import { Pagination } from "../../components/shared/Pagination";

import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import BookingCard from "../../components/shared/formcomponents/BookingCard";

function ManageMovies() {
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1); // Current page
	const [totalPages, setTotalPages] = useState(1);
	const { user } = useContext(AuthContext);
	const [movies, setMovies] = useState([]);
	return (
		<main className="py-8 px-8 flex flex-col items-center  min-h-svh w-full">
			<h1 className="text-2xl mb-lg-2 my-4">Manage Movies</h1>
			{loading && <div>Loading...</div>}
			{movies.map((item, i) => (
				<Link key={i} to={`./${item?.movieId}`}>
					<BookingCard
						// image={item?.images[0]}
						title={item?.movieName}
					></BookingCard>
				</Link>
			))}

			<Pagination page={page} setPage={setPage} totalPages={totalPages} />
		</main>
	);
}

export default ManageMovies;

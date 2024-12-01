import { useContext, useEffect, useState } from "react";

import { Pagination } from "../../components/shared/Pagination";

import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import toast from "react-hot-toast";
import axios from "axios";
import PosterSlider from "../../components/shared/PosterSlider";
import Poster from "../../components/shared/Poster";

function ManageTheaters() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1); // Current page
	const [totalPages, setTotalPages] = useState(1);
	const { user } = useContext(AuthContext);
	const [theaters, setTheaters] = useState([]);

	const { ownerid } = useParams();

	useEffect(() => {
		setLoading(true);

		async function getTheaters() {
			try {
				let serverUrl;
				if (!ownerid && user.role !== "Admin") {
					navigate(`./theaterowner/${user.loggedUserId}`);
				} else if (ownerid !== user.loggedUserId && user.role !== "Admin") {
					navigate(`./theaterowner/${user.loggedUserId}`);
				} else if (ownerid) {
					serverUrl = `${
						import.meta.env.VITE_SERVER_BASE_URL
					}/theaterowner/${ownerid}/theaters`;
				} else {
					serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}/theater/manage`;
				}
				const response = await axios.get(serverUrl, {
					params: { page, limit: 8 },
				});
				const responseData = response.data;
				setTheaters(responseData.theaters);
				setTotalPages(responseData.totalPages);
			} catch (err) {
				toast.error("Unable to fetch theaters");
			}
		}
		setLoading(false);
		getTheaters();
		// if (ownerid && user) serverUrl = `${VITE_SERVER_BASE_URL}`;
	}, [page, ownerid, navigate, user]);

	return (
		<main className="py-8 px-8 flex flex-col items-center justify-start min-h-svh w-full gap-8">
			<h1 className="text-2xl ">Theaters</h1>
			{loading && (
				<div className="flex w-52 flex-col gap-4">
					<div className="skeleton h-32 w-full"></div>
					<div className="skeleton h-4 w-28"></div>
					<div className="skeleton h-4 w-full"></div>
					<div className="skeleton h-4 w-full"></div>
				</div>
			)}
			<PosterSlider classes="h-full">
				{theaters.map((item, i) => (
					<Link to={`/theaters/${item.theaterId}/manage`} key={i}>
						<Poster url={item.images[0]} title={item.theaterName} />
					</Link>
				))}
			</PosterSlider>
			<Pagination page={page} setPage={setPage} totalPages={totalPages} />
		</main>
	);
}

export default ManageTheaters;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Skeleton from "../../components/shared/Skeleton";

export default function PaymentFailed() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		setLoading(false);
		toast.error("Payment Failed.. Try again");
		setTimeout(() => navigate("/shows"), 5000);
	}, []);
	return (
		<main className="mx-16 my-8 flex flex-col gap-4 items-center">
			{loading && <Skeleton />}
			{!loading && (
				<>
					<h1 className="text-3xl text-red-500">Payment Failed</h1>
					<Link to={"/shows"}>Try again.. Go to browse shows..</Link>
				</>
			)}
		</main>
	);
}

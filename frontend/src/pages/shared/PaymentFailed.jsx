import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function PaymentFailed() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		setLoading(false);
		toast.error("Payment Failed.. Try again");
		setTimeout(() => navigate("/login"), 5000);
	}, []);
	return (
		<main className="mx-16 my-8 flex flex-col gap-4 items-center">
			{loading && (
				<div className="flex w-52 flex-col gap-4">
					<div className="skeleton h-32 w-full"></div>
					<div className="skeleton h-4 w-28"></div>
					<div className="skeleton h-4 w-full"></div>
					<div className="skeleton h-4 w-full"></div>
				</div>
			)}
			{!loading && (
				<>
					<h1 className="text-3xl text-red-500">Payment Failed</h1>
					<Link to={"/shows"}>Try again.. Go to browse shows..</Link>
				</>
			)}
		</main>
	);
}

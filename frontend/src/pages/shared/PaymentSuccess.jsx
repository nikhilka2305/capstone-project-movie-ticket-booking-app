import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function PaymentSuccess() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [queryParams] = useSearchParams();

	const sessionId = queryParams.get("sessionId");
	useEffect(() => {
		try {
			const serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}`;
			async function getBookedData() {
				const response = await axios.get(
					`${serverUrl}/payments/get-session-data/?sessionId=${sessionId}`
				);
				const { bookinginfo, line_items } = response.data;

				let bookingData = await axios.post(
					`${serverUrl}/booking/newBooking`,
					bookinginfo,
					{
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
				toast.success("Booking Successful");
			}
			sessionId && getBookedData();
			setTimeout(() => navigate("/"), 5000);
		} catch (err) {
			toast.error("Booking failed!!");
		}
		setLoading(false);
	}, [sessionId, navigate]);
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
			{!loading && sessionId && (
				<>
					<h1 className="text-3xl text-green-500">Payment Success</h1>
				</>
			)}
		</main>
	);
}

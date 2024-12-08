import { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data, filter, onFilterChange }) {
	const chartData = {
		labels: data.map((item) => item.theaterName),
		datasets: [
			{
				label: filter === "revenue" ? "Revenue Share (₹)" : "Bookings Share",
				data: data.map((item) => item.value),
				backgroundColor: data.map(
					(_, index) => `hsl(${(index * 360) / data.length}, 70%, 60%)` // Dynamic colors
				),
				borderWidth: 1,
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: {
				display: true,
				position: "right",
			},
			title: {
				display: true,
				text: `Theater ${filter === "revenue" ? "Revenue" : "Bookings"} Share`,
			},
		},
	};

	return (
		<div className="p-4">
			<div className="flex justify-center mb-2">
				<button
					className={`btn ${filter === "bookings" ? "btn-active" : ""}`}
					onClick={() => onFilterChange("bookings")}
				>
					Bookings
				</button>
				<button
					className={`btn ${filter === "revenue" ? "btn-active" : ""}`}
					onClick={() => onFilterChange("revenue")}
				>
					Revenue
				</button>
			</div>
			<Pie data={chartData} options={options} />
		</div>
	);
}

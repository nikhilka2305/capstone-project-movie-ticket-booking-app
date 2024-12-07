import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const LineChart = ({ data, filter, onFilterChange }) => {
	useEffect(() => {}, [data, filter]);

	const chartData = {
		labels: data.map((item) => item.month),
		datasets: [
			{
				label: filter === "revenue" ? "Revenue (₹)" : "Bookings",
				data: data.map((item) => item.value),
				fill: false,
				borderColor: filter === "revenue" ? "#4CAF50" : "#2196F3",
				tension: 0.2,
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			title: {
				display: true,
				text: `Monthly ${filter === "revenue" ? "Revenue" : "Bookings"}`,
			},
		},
		// maintainAspectRatio: false,
	};

	return (
		<div className="p-4">
			<div className="flex justify-end mb-2">
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
			<Line data={chartData} options={options} height="250px" width="350px" />
		</div>
	);
};

export default LineChart;

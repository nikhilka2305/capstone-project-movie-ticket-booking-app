import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { generateRandomColors } from "../../utils/randomColorGenerate";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

export default function BarChart({ data, labelKey, valueKey, title }) {
	const backgroundColors = generateRandomColors(data.length);
	const borderColors = backgroundColors.map(
		(color) => color.replace("0.6", "1") // Make borders fully opaque
	);
	const chartData = {
		labels: data.map((item) => item[labelKey]),
		datasets: [
			{
				label: "Bookings",
				data: data.map((item) => item[valueKey]),
				backgroundColor: backgroundColors,
				borderColor: borderColors,
				borderWidth: 1,
			},
		],
	};
	const options = {
		responsive: true,
		plugins: {
			legend: { display: false },
			title: { display: true, text: title },
		},
	};
	return <Bar data={chartData} options={options} />;
}

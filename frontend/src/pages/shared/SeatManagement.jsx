import { useContext, useEffect, useState } from "react";
import SeatClassRangeSelector from "./SeatClassRangeSelector";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Button from "../../components/shared/formcomponents/Button";
import { SeatSelection } from "./SeatGrid";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { use } from "react";
import Skeleton from "../../components/shared/Skeleton";

export default function SeatManagement() {
	const navigate = useNavigate();
	const [seatClasses, setSeatClasses] = useState([
		{ className: "VIP", price: 500, rows: [] },
		{ className: "Regular", price: 300, rows: [] },
	]);
	const { isAuthenticated, user } = useContext(AuthContext);

	const [theaterSeats, setTheaterSeats] = useState({
		rows: 5,
		columns: 6,
		bookedSeats: ["4-1"],
		seatClasses: [
			{ className: "VIP", price: 500, rows: [] },
			{ className: "Regular", price: 300, rows: [] },
		], // Sample booked seats
	});
	const [loading, setLoading] = useState(false);
	const [maxRows, setMaxRows] = useState(10);
	const { theaterid } = useParams();

	useEffect(() => {
		const serverUrl = `${
			import.meta.env.VITE_SERVER_BASE_URL
		}/theater/${theaterid}/viewmanage`;
		async function getTheaterDetails() {
			try {
				setLoading(true);

				const theaterData = await axios.get(serverUrl);

				const theater = theaterData.data;
				if (
					user.role !== "Admin" &&
					user.loggedUserObjectId !== theater.owner.toString()
				) {
					navigate("/theaters");
				}
				setSeatClasses(theater.seatClasses || []);
				setMaxRows(theater.seats.rows);
			} catch (err) {
				toast.error("Unable to fetch theater data");
			}
		}

		getTheaterDetails();
		setLoading(false);
	}, [theaterid, navigate, user]);
	useEffect(() => {
		async function getTheaterData() {
			const serverUrl = `${
				import.meta.env.VITE_SERVER_BASE_URL
			}/theater/${theaterid}/viewmanage`;
			try {
				const theaterData = await axios.get(serverUrl);

				const theater = theaterData.data;

				setTheaterSeats({
					rows: theater.seats.rows,
					columns: theater.seats.seatsPerRow,
					bookedSeats: [],
					seatClasses: seatClasses,
				});
			} catch (err) {
				toast.error("Unable to fetch theater data");
			}
		}
		getTheaterData();
	}, [theaterid, seatClasses]);

	const rows = Array.from({ length: maxRows }, (_, i) => i + 1); // [1, 2, ..., 10]

	const handleRangeChange = ({ selectedClass, startRow, endRow }) => {
		setSeatClasses((prevClasses) =>
			prevClasses.map((seatClass) =>
				seatClass.className === selectedClass
					? {
							...seatClass,
							rows: Array.from(
								{ length: endRow - startRow + 1 },
								(_, i) => startRow + i
							),
					  }
					: seatClass
			)
		);
	};

	const handleReset = (selectedClass) => {
		setSeatClasses((prevClasses) =>
			prevClasses.map((seatClass) =>
				seatClass.className === selectedClass
					? { ...seatClass, rows: [] }
					: seatClass
			)
		);
	};

	const handleSeatUpdate = async () => {
		const updatedClasses = seatClasses.map((seatClass) => {
			delete seatClass._id;
			return seatClass;
		});

		const updateSeatClasses = { seatClasses: updatedClasses };

		const serverUrl = `${
			import.meta.env.VITE_SERVER_BASE_URL
		}/theater/${theaterid}`;
		try {
			const seatsUpdated = await axios.patch(`${serverUrl}`, updateSeatClasses);
			toast.success("Successfully updated seats");
			navigate("..");
		} catch (err) {
			toast.error("Unable to update seats");
		}
	};
	const assignedRows = seatClasses.flatMap((sc) => sc.rows);
	const unallocatedRows = rows.filter((row) => !assignedRows.includes(row));

	return (
		<>
			<main className="py-8 px-8 flex flex-col items-center  min-h-svh w-full">
				<Link to="..">Go Back to Manage Theater</Link>
				{loading && <Skeleton />}
				{!loading && (
					<>
						<SeatClassRangeSelector
							seatClasses={seatClasses}
							maxRows={maxRows}
							assignedRows={assignedRows}
							onRangeChange={handleRangeChange}
							onReset={handleReset}
						/>

						{unallocatedRows.length > 0 &&
							seatClasses.every((sc) => sc.rows.length > 0) && (
								<p className="text-orange-500 text-sm my-4">
									Warning: Some rows ({unallocatedRows.join(", ")}) remain
									unallocated.
								</p>
							)}
						<Button
							onClick={handleSeatUpdate}
							disabled={unallocatedRows.length > 0 ? "disabled" : false}
							label="Update Seats"
						/>
						<h2 className="mt-4">Seat Grid</h2>
						<SeatSelection theaterSeats={theaterSeats} />
					</>
				)}
			</main>
		</>
	);
}

import React, { useEffect, useState } from "react";
import { generateClassColors } from "../../utils/classcolorgenerate";
import {
	convertToLetter,
	formatSeatNumber,
} from "../../utils/numbertoLetterID";

const generateGrid = (rows, columns, bookedSeats = [], seatClasses) => {
	const grid = [];
	const seatIndex = 0;
	for (let i = 1; i <= rows; i++) {
		const row = [];
		for (let j = 1; j <= columns; j++) {
			const seatClass = seatClasses.find((cls) => {
				return cls.rows.includes(i);
			});
			if (seatClass) console.log("done");
			const className = seatClass ? seatClass.className : "Unallocated";
			console.log(className);
			const seatNumber = `${i}-${j}`;
			row.push({
				seatNumber,
				isBooked: bookedSeats.includes(seatNumber),
				className,
			});
		}
		grid.push(row);
	}
	return grid;
};

function SeatLegend({ classColors }) {
	return (
		<div className="mt-4 mb-4">
			<h3 className="text-lg font-bold">Seat Class Legend</h3>
			<div className="flex gap-4">
				{Object.entries(classColors).map(([className, color]) => (
					<div key={className} className="flex items-center gap-2">
						<div className={`w-6 h-6 rounded ${color}`}></div>
						<span>{className}</span>
					</div>
				))}
			</div>
		</div>
	);
}

function SeatGrid({ seatGrid, onSeatSelect, classColors }) {
	console.log(classColors);
	return (
		<section className="grid grid-rows gap-2 mt-8">
			{seatGrid.map((row, rowIndex) => (
				<div key={rowIndex} className="flex gap-1">
					<div className="flex items-center justify-center w-8 font-bold">
						{convertToLetter(rowIndex)}
					</div>
					{row.map((seat) => (
						<button
							key={seat.seatNumber}
							className={`w-12 h-12 rounded rounded-md text-sm ${
								seat.isBooked
									? "bg-red-500 text-black"
									: classColors[seat.className] || "bg-gray-300"
							}`}
							disabled={seat.isBooked}
							onClick={() => onSeatSelect(seat.seatNumber)}
							// onClick={() => {
							// 	console.log(seat.seatNumber);
							// }}
						>
							{formatSeatNumber(seat.seatNumber)}
						</button>
					))}
				</div>
			))}
		</section>
	);
}

export function SeatSelection({ theaterSeats }) {
	const classColors = generateClassColors(theaterSeats.seatClasses);
	console.log(theaterSeats);
	const [seatGrid, setSeatGrid] = useState(() =>
		generateGrid(
			theaterSeats.rows,
			theaterSeats.columns,
			theaterSeats.bookedSeats,
			theaterSeats.seatClasses
		)
	);

	useEffect(() => {
		setSeatGrid(() =>
			generateGrid(
				theaterSeats.rows,
				theaterSeats.columns,
				theaterSeats.bookedSeats,
				theaterSeats.seatClasses
			)
		);
	}, [theaterSeats]);

	const [selectedSeats, setSelectedSeats] = useState([]);
	console.log(selectedSeats);
	const handleSeatSelect = (seatNumber) => {
		setSelectedSeats((prev) =>
			prev.includes(seatNumber)
				? prev.filter((seat) => seat !== seatNumber)
				: [...prev, formatSeatNumber(seatNumber)]
		);
	};

	return (
		<div>
			<SeatGrid
				seatGrid={seatGrid}
				onSeatSelect={handleSeatSelect}
				classColors={classColors}
			/>
			<SeatLegend classColors={classColors} />
			<div className="mt-4">
				<h3>Selected Seats:</h3>
				{selectedSeats.join(", ")}
			</div>
		</div>
	);
}

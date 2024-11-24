import React, { useEffect, useState } from "react";
import { generateClassColors } from "../../utils/classcolorgenerate";
import {
	convertToLetter,
	formatSeatNumber,
} from "../../utils/numbertoLetterID";

const generateGrid = (
	rows,
	columns,
	bookedSeats = [],
	selectedSeats = [],
	seatClasses
) => {
	const grid = [];
	const seatIndex = 0;
	for (let i = 1; i <= rows; i++) {
		const row = [];
		for (let j = 1; j <= columns; j++) {
			const seatClass = seatClasses.find((cls) => {
				return cls.rows.includes(i);
			});

			const className = seatClass ? seatClass.className : "Unallocated";

			const price = seatClass ? seatClass.price : 0;

			const seatNumber = `${i}-${j}`;
			const isSelected = selectedSeats.some(
				(selected) => selected.seatNumber === seatNumber
			);
			row.push({
				seatNumber,
				isBooked: bookedSeats.includes(seatNumber),
				isSelected,
				className,
				price,
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

function SeatGrid({ seatGrid, onSeatSelect, classColors, displayOnly }) {
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
									: seat.isSelected
									? "bg-gray-600 text-white"
									: classColors[seat.className] || "bg-gray-300 text-black"
							}`}
							disabled={seat.isBooked || displayOnly}
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

export function SeatSelection({
	theaterSeats,
	displayOnly = true,
	selectedSeats,
	setSelectedSeats,
}) {
	const classColors = generateClassColors(theaterSeats.seatClasses);
	console.log(selectedSeats);
	const [seatGrid, setSeatGrid] = useState(() =>
		generateGrid(
			theaterSeats.rows,
			theaterSeats.columns,
			theaterSeats.bookedSeats,
			theaterSeats.selectedSeats,
			theaterSeats.seatClasses
		)
	);

	useEffect(() => {
		setSeatGrid(() =>
			generateGrid(
				theaterSeats.rows,
				theaterSeats.columns,
				theaterSeats.bookedSeats,
				theaterSeats.selectedSeats,
				theaterSeats.seatClasses
			)
		);
	}, [theaterSeats]);

	// const [selectedSeats, setSelectedSeats] = useState([]);

	const handleSeatSelect = (seatNumber) => {
		console.log(seatNumber);
		const row = parseInt(seatNumber.split("-")[0]);
		const seatClass = theaterSeats.seatClasses.find((seatClass) =>
			seatClass.rows.includes(row)
		);
		if (!seatClass) {
			console.error("Seat class not found for row:", row);
			return;
		}
		// console.log(...selectedSeats);
		// setSelectedSeats((prev) =>
		// 	prev.includes(seatNumber)
		// 		? prev.filter((seat) => seat !== seatNumber)
		// 		: [...prev, seatNumber]
		// );
		const isSelected = selectedSeats.find(
			(seat) => seat.seatNumber === seatNumber
		);

		if (isSelected) {
			// If already selected, remove it
			setSelectedSeats(
				selectedSeats.filter((seat) => seat.seatNumber !== seatNumber)
			);
		} else {
			// If not selected, add it with class details
			setSelectedSeats((selSeats) => [
				...selSeats,
				{ seatNumber, className: seatClass.className, price: seatClass.price },
			]);
		}
	};

	return (
		<div className="w-full flex flex-col justify-center items-center">
			<SeatGrid
				seatGrid={seatGrid}
				onSeatSelect={handleSeatSelect}
				classColors={classColors}
				displayOnly={displayOnly}
			/>
			<SeatLegend classColors={classColors} />
		</div>
	);
}

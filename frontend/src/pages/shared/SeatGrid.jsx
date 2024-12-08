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
	return (
		<section className="overflow-x-auto">
			<div className="inline-block min-w-full">
				<div
					className="grid gap-2"
					style={{ gridTemplateRows: `repeat(${seatGrid.length}, auto)` }}
				>
					{seatGrid.map((row, rowIndex) => (
						<div key={rowIndex} className="flex gap-1 items-center">
							<div className="flex items-center justify-center w-6 font-bold">
								{convertToLetter(rowIndex)}
							</div>
							{row.map((seat) => (
								<button
									key={seat.seatNumber}
									className={`w-8 h-8 md:w-12 md:h-12 rounded text-sm ${
										seat.isBooked
											? "bg-red-500 text-black"
											: seat.isSelected
											? "bg-gray-600 text-white"
											: classColors[seat.className] || "bg-gray-300 text-black"
									}`}
									disabled={seat.isBooked || displayOnly}
									onClick={() => onSeatSelect(seat.seatNumber)}
								>
									{formatSeatNumber(seat.seatNumber)}
								</button>
							))}
						</div>
					))}
				</div>
			</div>
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
		const row = parseInt(seatNumber.split("-")[0]);
		const seatClass = theaterSeats.seatClasses.find((seatClass) =>
			seatClass.rows.includes(row)
		);
		if (!seatClass) {
			return;
		}

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
			<div className="screenishere border mt-2 mb-4 w-11/12 md:w-1/3 text-center">
				<p>Screen is Here</p>
			</div>
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

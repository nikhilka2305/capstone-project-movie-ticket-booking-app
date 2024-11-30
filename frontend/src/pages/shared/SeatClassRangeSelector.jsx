import React, { useState } from "react";
import Input from "../../components/shared/formcomponents/Input";

export default function SeatClassRangeSelector({
	seatClasses,
	maxRows,
	assignedRows,
	onRangeChange,
	onReset,
}) {
	const [selectedClass, setSelectedClass] = useState("");
	const [startRow, setStartRow] = useState("");
	const [endRow, setEndRow] = useState("");
	const [editingClass, setEditingClass] = useState("");
	const [attemptedInvalid, setAttemptedInvalid] = useState(false);

	const handleUpdate = () => {
		if (isInvalidRange) {
			setAttemptedInvalid(true);
			return;
		}
		onRangeChange({
			selectedClass,
			startRow: Number(startRow),
			endRow: Number(endRow),
		});
		resetForm();
		setAttemptedInvalid(false);
	};

	const resetForm = () => {
		setSelectedClass("");
		setStartRow("");
		setEndRow("");
		setEditingClass("");
	};

	const isInvalidRange =
		!selectedClass ||
		!startRow ||
		!endRow ||
		startRow < 1 ||
		startRow > maxRows ||
		endRow < 1 ||
		endRow > maxRows ||
		Number(startRow) > Number(endRow) ||
		assignedRows.some(
			(row) =>
				row >= Number(startRow) &&
				row <= Number(endRow) &&
				!(
					editingClass &&
					seatClasses
						.find((sc) => sc.className === editingClass)
						.rows.includes(row)
				)
		);

	const handleEdit = (className) => {
		const { rows } = seatClasses.find((sc) => sc.className === className);
		setEditingClass(className);
		setSelectedClass(className);
		setStartRow(rows[0] || "");
		setEndRow(rows[rows.length - 1] || "");
	};

	return (
		<section className="flex flex-col gap-8 mt-8 w-full ">
			<h2 className="mx-auto text-2xl">Seat Class Allotment</h2>
			<div className="flex gap-16 justify-center">
				<select
					value={selectedClass}
					onChange={(e) => setSelectedClass(e.target.value)}
					disabled={editingClass}
					className="py-2 pl-4 pr-2 rounded-md border border-gray-500 w-1/3 max-w-64"
				>
					<option value="" disabled>
						Select Seat Class
					</option>
					{seatClasses.map((seatClass) => (
						<option
							key={seatClass.className}
							value={seatClass.className}
							disabled={
								seatClass.rows.length > 0 &&
								seatClass.className !== editingClass
							}
						>
							{seatClass.className}
						</option>
					))}
				</select>

				{/* Start Row */}

				<input
					type="number"
					placeholder="Start Row"
					value={startRow}
					min={1}
					max={maxRows}
					onChange={(e) => setStartRow(e.target.value)}
					className="py-2 pl-4 pr-2 rounded-md border border-gray-500 w-1/3 max-w-64"
				/>

				{/* End Row */}
				<input
					type="number"
					placeholder="End Row"
					value={endRow}
					min={1}
					max={maxRows}
					onChange={(e) => setEndRow(e.target.value)}
					className="py-2 pl-4 pr-2 rounded-md border border-gray-500 w-1/3 max-w-64"
				/>
			</div>

			{/* Feedback for invalid selection */}
			{isInvalidRange && attemptedInvalid && (
				<p className="text-red-500 text-sm mx-auto">
					Invalid range: Overlapping or out of bounds!
				</p>
			)}

			<div className="flex gap-4">
				{/* Assign Range Button */}
				<button
					type="button"
					onClick={handleUpdate}
					// disabled={isInvalidRange}
					className="py-2 px-4 bg-blue-500 text-white rounded mx-auto"
				>
					{editingClass ? "Update Range" : "Assign Range"}
				</button>

				{/* Reset Seat Class Button */}
				{selectedClass && (
					<button
						type="button"
						onClick={() => {
							onReset(selectedClass);
							resetForm();
						}}
						className="py-2 px-4 bg-red-500 text-white rounded"
					>
						{editingClass ? "Cancel Edit" : `Reset ${selectedClass}`}
					</button>
				)}
			</div>

			{/* List existing seat class allocations */}
			<h4 className="text-lg font-semibold mt-2 mx-auto">
				Seat Class Allocations:
			</h4>
			<ul className="mb-4">
				{seatClasses.map((seatClass) => (
					<li
						key={seatClass.className}
						className="flex justify-center gap-8 items-center"
					>
						<span>
							{seatClass.className}:{" "}
							{seatClass.rows.length > 0
								? `${seatClass.rows[0]} - ${
										seatClass.rows[seatClass.rows.length - 1]
								  }`
								: "Not Assigned"}
						</span>
						{seatClass.rows.length > 0 && (
							<button
								type="button"
								onClick={() => handleEdit(seatClass.className)}
								className="py-1 px-3 bg-yellow-500 text-white rounded"
							>
								Edit
							</button>
						)}
					</li>
				))}
			</ul>
		</section>
	);
}

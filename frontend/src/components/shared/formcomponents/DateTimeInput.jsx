import React, { forwardRef } from "react";
import { formatToISTDateTime } from "../../../utils/dateFormatter";

const DateTimeInput = forwardRef(
	({ label, value, onChange, name, errors }, ref) => {
		console.log(errors);

		// Convert the UTC date to IST format for display in the input
		const handleInput = (evt) => {
			const inputValue = evt.target.value;

			if (inputValue) {
				const localDate = new Date(inputValue); // Parse selected date (in IST)

				// Convert to UTC by subtracting IST offset (5:30 hours)
				const utcDate = new Date(localDate.getTime() - 5.5 * 60 * 60 * 1000);

				console.log("Converted UTC Date:", utcDate.toISOString()); // Log the UTC Date
				onChange(utcDate.toISOString()); // Send UTC to parent component
			} else {
				onChange(""); // Handle empty input
			}
		};

		// Convert UTC Date to IST format for input display
		const formatToISTDateTimeForInput = (utcDateStr) => {
			if (!utcDateStr) return "";
			const utcDate = new Date(utcDateStr);
			const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);
			const year = istDate.getFullYear();
			const month = String(istDate.getMonth() + 1).padStart(2, "0");
			const day = String(istDate.getDate()).padStart(2, "0");
			const hours = String(istDate.getHours()).padStart(2, "0");
			const minutes = String(istDate.getMinutes()).padStart(2, "0");
			return `${year}-${month}-${day}T${hours}:${minutes}`;
		};

		const getNestedError = (obj, path) => {
			// Ensure 'obj' is an object and 'path' is a string
			if (!obj || typeof path !== "string") return undefined;

			// Split the path and reduce to access nested error
			return path.split(".").reduce((acc, key) => acc?.[key], obj);
		};
		return (
			<div className="flex flex-col justify-center px-8">
				<label htmlFor={name} className="input-label">
					{label}
				</label>
				<input
					type="datetime-local"
					id={name}
					name={name}
					value={formatToISTDateTimeForInput(value)} // Display time in IST format for input
					onChange={handleInput} // Handle change and convert to UTC
					className="input input-bordered py-2 pl-4 pr-2 w-full"
					ref={ref} // Forward the ref here for React Hook Form
				/>
				{errors &&
					(errors[name]?.message ? (
						<span className="error mx-auto text-sm text-red-600">
							{errors[name]?.message}
						</span>
					) : (
						<span className="error mx-auto text-sm text-red-600">
							{getNestedError(errors, name)?.message}
						</span>
					))}
			</div>
		);
	}
);

export default DateTimeInput;

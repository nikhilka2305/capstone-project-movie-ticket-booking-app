import HandleError from "../middleware/errorHandling.js";

export function validateDateTime(date) {
	const inputDate = new Date(date);
	const now = new Date();

	if (isNaN(inputDate.getTime())) {
		throw new HandleError("Invalid date format.", 500);
	}

	// Check if the date is in the past
	if (inputDate < now) {
		throw new HandleError("The date is in the past.", 500);
	}

	// Check if the date is less than 1 hour from now
	const timeDifferenceInMinutes =
		(inputDate.getTime() - now.getTime()) / (1000 * 60);
	if (timeDifferenceInMinutes <= 60) {
		throw new HandleError("The date must be at least 1 hour from now.", 500);
	}

	return true;
}

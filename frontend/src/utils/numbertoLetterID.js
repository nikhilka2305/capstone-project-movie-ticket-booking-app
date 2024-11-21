export function formatSeatNumber(seatNumber) {
	const [row, column] = seatNumber.split("-"); // Split row and column
	const rowIndex = parseInt(row, 10) - 1; // Convert row to 0-based index
	const letterRow = convertToLetter(rowIndex); // Convert row index to letter
	return `${letterRow}-${column}`; // Return formatted seat number
}

export function convertToLetter(rowIndex) {
	let letter = "";
	while (rowIndex >= 0) {
		letter = String.fromCharCode((rowIndex % 26) + 65) + letter;
		rowIndex = Math.floor(rowIndex / 26) - 1;
	}
	return letter;
}

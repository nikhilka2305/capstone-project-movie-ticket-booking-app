export function formatDate(date) {
	if (!(date instanceof Date) || isNaN(date.getTime())) {
		console.error("Invalid date:", date);
		return "Invalid date";
	}
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
	const year = date.getFullYear();
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");

	return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export const formatDateYYYYMMDD = (date) => {
	if (!(date instanceof Date) || isNaN(date.getTime())) {
		console.error("Invalid date:", date);
		return "Invalid date";
	}
	if (!date) return "";
	const d = new Date(date);
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

export function formatDateTimeLocal(date) {
	if (!(date instanceof Date) || isNaN(date.getTime())) {
		console.error("Invalid date:", date);
		return "Invalid date";
	}
	if (!date) return "";
	const d = new Date(date);
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	const hours = String(d.getHours()).padStart(2, "0");
	const minutes = String(d.getMinutes()).padStart(2, "0");

	return `${year}-${month}-${day}T${hours}:${minutes}`;
}

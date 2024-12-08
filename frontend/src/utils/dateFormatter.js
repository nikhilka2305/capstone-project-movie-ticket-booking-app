import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export function formatDate(date) {
	if (!(date instanceof Date) || isNaN(date.getTime())) {
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
	if (!(new Date(date) instanceof Date) || isNaN(new Date(date).getTime())) {
		if (!(date instanceof Date) || isNaN(date.getTime())) return "Invalid date";
	}

	if (!date) return "";
	const d = new Date(date);
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

export function formatDateTimeLocal(date) {
	if (!(new Date(date) instanceof Date) || isNaN(new Date(date).getTime())) {
		if (!(date instanceof Date) || isNaN(date.getTime())) return "Invalid date";
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

export function dayJSISTtoUTC(date) {
	const showTimeUTC = dayjs.tz(date, "Asia/Kolkata").utc().format();
	return showTimeUTC;
}

export function dayJSUTCtoIST(date) {
	const showTimeIST = dayjs
		.utc(date)
		.tz("Asia/Kolkata")
		.format("YYYY-MM-DD HH:mm");
	return showTimeIST;
}

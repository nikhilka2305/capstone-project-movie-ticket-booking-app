export default class HandleError extends Error {
	constructor(message, statusCode) {
		super();
		this.message = message || "Unknown Error";
		this.statusCode = statusCode || 500;
	}
}

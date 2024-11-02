const mongoose = require("mongoose");

function connectDB() {
	mongoose
		.connect(process.env.MONGODB_CONNECTION_STRING)
		.then(console.log("MongoDB connected"))
		.catch((err) => {
			console.log("Unable to connect to Database... Please check");
		});
}

module.exports = connectDB;

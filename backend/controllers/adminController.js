import { Admin } from "../models/AdminUser.js";

export const viewAdmins = async (req, res, next) => {
	try {
		const admins = await Admin.find();
		res.json(admins);
	} catch (err) {
		console.log("Unable to get user Data");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};

export const addAdmin = async (req, res, next) => {
	const { username, email, passwordHash } = req.body;
	try {
		const admin = new Admin({
			username,
			email,
			passwordHash,
		});
		await admin.save();
		return res.send("Success");
	} catch (err) {
		console.log("Unable to save Admin");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};

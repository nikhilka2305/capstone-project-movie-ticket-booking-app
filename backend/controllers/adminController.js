import { Admin } from "../models/Admin.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/createToken.js";

export const viewAdmins = async (req, res, next) => {
	console.log(req.user);

	try {
		const admins = await Admin.find().select("-passwordHash");
		res.json(admins);
	} catch (err) {
		console.log("Unable to get user Data");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};

export const viewAdminProfile = async (req, res, next) => {
	const { adminid } = req.params;

	try {
		const admin = await Admin.findOne({ adminId: adminid }).select(
			"-passwordHash"
		);
		if (!admin) throw new Error("No such theater admin exists");
		res.status(200).json(admin);
	} catch (err) {
		console.log("Unable to get Admin Data");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};

export const updateAdminProfile = async (req, res, next) => {
	const { adminid } = req.params;

	/*

		Update Admin Profile Logic

		*/

	return res.send("Update Admin Profile page works");
};

export const registerAdmin = async (req, res, next) => {
	const { adminname, email, mobile, password } = req.body;
	const passwordHash = await bcrypt.hash(password, 10);
	try {
		const admin = new Admin({
			adminname,
			email,
			mobile,
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

export const loginAdmin = async (req, res) => {
	const { adminname, password } = req.body;

	try {
		const admin = await Admin.findOne({
			adminname: adminname,
		});
		if (!admin) {
			throw new Error("Invalid Admin Credentials-TON");
		} else {
			const passwordMatch = await bcrypt.compare(password, admin.passwordHash);
			if (!passwordMatch) {
				throw new Error("Invalid Admin Credentials");
			} else {
				const token = createToken({
					adminId: admin.adminId,
					adminname: adminname,
					role: admin.role,
					id: admin._id,
				});
				console.log(token);
				res.cookie("token", token, {
					expires: new Date(Date.now() + 6 * 60 * 60 * 1000),
					httpOnly: true,
				});
				res.status(200).json({ message: "Succesfully Logged In" });
			}
		}
	} catch (err) {
		res.status(403).json({
			error: "Login Failed",
			message: err.message,
		});
	}
};

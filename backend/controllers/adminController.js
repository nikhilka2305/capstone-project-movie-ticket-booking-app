import { Admin } from "../models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const viewAdmins = async (req, res, next) => {
	console.log(req.user);
	if (req.user.role !== "Admin")
		res.status(403).json({
			error: "Authorization Error",
			message: "You are not authorized to see this page",
		});
	else {
		try {
			const admins = await Admin.find();
			res.json(admins);
		} catch (err) {
			console.log("Unable to get user Data");
			console.log(err.message);
			return res.json({ message: "Error", error: err.message });
		}
	}
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
				const token = jwt.sign(
					{
						adminId: admin.adminId,
						adminname: adminname,
						role: admin.role,
					},
					process.env.JWT_ACCESS_TOKEN_COMMON_SECRET,
					{ expiresIn: "6h" }
				);
				console.log(token);
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

import { Admin } from "../models/Admin.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/createToken.js";
import { uploadDisplayImage } from "../utils/cloudinaryUpload.js";

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
		const admin = await Admin.findOne({ userId: adminid }).select(
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

	try {
		const { mobile, email } = req.body;
		const image = req.file;
		let displayImage;
		if (image) {
			console.log("><><>Admin<<<<>>");
			console.log(image);

			displayImage = await uploadDisplayImage(image);
		}
		const user = await Admin.findOneAndUpdate(
			{ userId: adminid },
			{ mobile, email, displayImage: displayImage },
			{ runValidators: true, new: true }
		);
		console.log(user);
		console.log("Updating Admin Profile");

		res.status(201).json("Profile updated");
	} catch (err) {
		res
			.status(500)
			.json({ error: "Unable to update profile", message: err.message });
	}
};

export const registerAdmin = async (req, res, next) => {
	const { username, email, mobile, password } = req.body;
	const passwordHash = await bcrypt.hash(password, 10);
	try {
		const admin = new Admin({
			username,
			email,
			mobile,
			passwordHash,
			displayImage:
				"https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg?s=612x612&w=0&k=20&c=UEa7oHoOL30ynvmJzSCIPrwwopJdfqzBs0q69ezQoM8=",
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
	const { username, password } = req.body;

	try {
		const admin = await Admin.findOne({
			username: username,
		});
		if (!admin || admin.deleted || admin.blocked) {
			throw new Error("Invalid Admin Credentials-TON");
		} else {
			const passwordMatch = await bcrypt.compare(password, admin.passwordHash);
			if (!passwordMatch) {
				throw new Error("Invalid Admin Credentials");
			} else {
				const token = createToken({
					userId: admin.userId,
					username: username,
					role: admin.role,
					id: admin._id,
				});
				console.log(token);
				res.cookie("token", token, {
					expires: new Date(Date.now() + 6 * 60 * 60 * 1000),
					httpOnly: true,
				});
				res
					.status(200)
					.json({ message: "Succesfully Logged In", token: token });
			}
		}
	} catch (err) {
		res.status(403).json({
			error: "Login Failed",
			message: err.message,
		});
	}
};

export const resetAdminPassword = async (req, res, next) => {
	// const { adminid } = req.params;

	if (req.user.role !== "Admin")
		return res.status(403).json({
			error: "Authorization Error",
			message: "You are not authorized to reset Password",
		});
	try {
		const { newPassword } = req.body;

		const newPasswordHash = await bcrypt.hash(newPassword, 10);
		console.log(newPasswordHash);
		console.log(req.user.loggedUserObjectId);
		const admin = await Admin.findByIdAndUpdate(
			req.user.loggedUserObjectId,
			{ passwordHash: newPasswordHash },
			{ new: true }
		);
		console.log(admin);
		console.log("Resetting password");

		res.status(201).json("Password Reset");
	} catch (err) {
		res
			.status(500)
			.json({ error: "Unable to Reset Password", message: err.message });
	}
};

export const deleteAdmin = async (req, res, next) => {
	const { adminid } = req.params;
	console.log(req.user);

	if (req.user.role !== "Admin")
		return res.status(403).json({
			error: "Authorization Error",
			message: "You are not authorized to reset Password",
		});
	try {
		const admin = await Admin.findOne({ userId: adminid });
		if (!admin || admin.deleted)
			return res
				.status(404)
				.json("This account doesn't exist or is already deleted");
		else {
			await Admin.findOneAndUpdate(
				{ userId: adminid },
				{ deleted: true },
				{ new: true }
			);
			console.log(admin);
			console.log("Deleting Account");
			if (req.user.loggedUserId === adminid)
				return res.status(204).clearCookie("token").json("Account Deleted");
			return res.status(204).json("Account Deleted");
		}
	} catch (err) {
		res
			.status(500)
			.json({ error: "Unable to delete account", message: err.message });
	}
};

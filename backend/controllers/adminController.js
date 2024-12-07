import { Admin } from "../models/Admin.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/createToken.js";
import { uploadDisplayImage } from "../utils/cloudinaryUpload.js";
import HandleError from "../middleware/errorHandling.js";

export const viewAdmins = async (req, res, next) => {
	try {
		const admins = await Admin.find().select("-passwordHash");
		res.status(200).json(admins);
	} catch (err) {
		return res
			.status(err?.statusCode || 404)
			.json({ message: "Error", error: err?.message });
	}
};

export const viewAdminProfile = async (req, res, next) => {
	const { adminid } = req.params;

	try {
		const admin = await Admin.findOne({ userId: adminid }).select(
			"-passwordHash"
		);
		if (!admin) throw new HandleError("No such admin exists", 404);
		res.status(200).json(admin);
	} catch (err) {
		return res
			.status(err?.statusCode || 500)
			.json({ message: "Error", error: err?.message });
	}
};

export const updateAdminProfile = async (req, res, next) => {
	const { adminid } = req.params;

	try {
		const { mobile, email } = req.body;
		const image = req.file;
		let displayImage;
		if (image) {
			displayImage = await uploadDisplayImage(image);
		}
		const user = await Admin.findOneAndUpdate(
			{ userId: adminid },
			{ mobile, email, displayImage: displayImage },
			{ runValidators: true, new: true }
		);

		res.status(201).json({ message: "Profile updated", user: user });
	} catch (err) {
		res
			.status(err?.statusCode || 500)
			.json({ error: "Unable to update profile", message: err?.message });
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
		return res.status(200).send("Success");
	} catch (err) {
		return res
			.status(err?.statusCode || 500)
			.json({ message: "Error", error: err?.message });
	}
};

export const loginAdmin = async (req, res) => {
	const { username, password } = req.body;

	try {
		const admin = await Admin.findOne({
			username: username,
		});
		if (!admin || admin.deleted || admin.blocked) {
			throw new HandleError("Invalid Admin Credentials-TON", 403);
		} else {
			const passwordMatch = await bcrypt.compare(password, admin.passwordHash);
			if (!passwordMatch) {
				throw new HandleError("Invalid Admin Credentials", 403);
			} else {
				const token = createToken({
					userId: admin.userId,
					username: username,
					displayImage: admin.displayImage,
					role: admin.role,
					id: admin._id,
				});

				res.cookie("token", token, {
					expires: new Date(Date.now() + 6 * 60 * 60 * 1000),
					sameSite: "none",
					secure: true,
					httpOnly: true,
				});
				res.status(200).json({ message: "Succesfully Logged In" });
			}
		}
	} catch (err) {
		res.status(err?.statusCode || 403).json({
			error: "Login Failed",
			message: err?.message,
		});
	}
};

export const resetAdminPassword = async (req, res, next) => {
	if (req.user.role !== "Admin")
		throw new HandleError("You are not authorized to reset Password", 403);
	try {
		const { newPassword } = req.body;

		const newPasswordHash = await bcrypt.hash(newPassword, 10);

		const admin = await Admin.findByIdAndUpdate(
			req.user.loggedUserObjectId,
			{ passwordHash: newPasswordHash },
			{ new: true }
		);

		res.status(201).json("Password Reset");
	} catch (err) {
		res
			.status(err?.statusCode || 500)
			.json({ error: "Unable to Reset Password", message: err?.message });
	}
};

export const deleteAdmin = async (req, res, next) => {
	const { adminid } = req.params;

	if (req.user.role !== "Admin")
		throw new HandleError("You are not authorized to reset Password", 403);
	try {
		const admin = await Admin.findOne({ userId: adminid });
		if (!admin || admin.deleted)
			throw new HandleError(
				"This account doesn't exist or is already deleted",
				404
			);
		else {
			await Admin.findOneAndUpdate(
				{ userId: adminid },
				{ deleted: true },
				{ new: true }
			);

			if (req.user.loggedUserId === adminid)
				return res.status(204).clearCookie("token").json("Account Deleted");
			return res.status(204).json("Account Deleted");
		}
	} catch (err) {
		res
			.status(err?.statusCode || 500)
			.json({ error: "Unable to delete account", message: err?.message });
	}
};

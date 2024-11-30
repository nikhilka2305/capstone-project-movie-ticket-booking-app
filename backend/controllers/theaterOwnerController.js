import { TheaterOwner } from "../models/TheaterOwner.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/createToken.js";
import { uploadDisplayImage } from "../utils/cloudinaryUpload.js";
import { handleTheaterOwnerDeletion } from "../utils/deleteCascadeManager.js";

export const viewTheaterOwners = async (req, res, next) => {
	const { active } = req.query;

	let filterCondition = {};
	if (active) {
		filterCondition = { deleted: false, blocked: false };
	}
	// active ? {fi}

	try {
		const owners = await TheaterOwner.find(filterCondition).select(
			"-passwordHash"
		);
		res.json(owners);
	} catch (err) {
		return res.json({ message: "Error", error: err.message });
	}
};

export const viewTheaterOwnerProfile = async (req, res, next) => {
	const { ownerid } = req.params;

	if (req.user.role !== "Admin" && req.user.loggedUserId !== ownerid)
		return res.status(403).json({
			error: "Authorization Error",
			message: "You are not authorized to see this page",
		});

	try {
		const owner = await TheaterOwner.findOne({ userId: ownerid }).select(
			"-passwordHash"
		);
		if (!owner) throw new Error("No such theater owner exists");
		res.status(200).json(owner);
	} catch (err) {
		return res.json({ message: "Error", error: err.message });
	}
};

export const updateTheaterOwnerProfile = async (req, res, next) => {
	const { ownerid } = req.params;

	if (req.user.role !== "Admin" && req.user.loggedUserId !== ownerid) {
		return res.status(403).json({
			error: "Authorization Error",
			message: "You are not authorized to see this page",
		});
	}

	try {
		const { mobile, email } = req.body;
		const image = req.file;
		let displayImage;
		if (image) {
			displayImage = await uploadDisplayImage(image);
		}

		const user = await TheaterOwner.findOneAndUpdate(
			{ userId: ownerid },
			{ mobile, email, displayImage: displayImage },
			{ runValidators: true, new: true }
		);

		res.status(201).json({ message: "Profile updated", user: user });
	} catch (err) {
		res
			.status(500)
			.json({ error: "Unable to update profile", message: err.message });
	}
};

export const registerTheaterOwner = async (req, res, next) => {
	const { username, email, mobile, password } = req.body;

	const passwordHash = await bcrypt.hash(password, 10);
	try {
		const owner = new TheaterOwner({
			username,
			email,
			mobile,
			passwordHash,
			displayImage:
				"https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg?s=612x612&w=0&k=20&c=UEa7oHoOL30ynvmJzSCIPrwwopJdfqzBs0q69ezQoM8=",
		});
		await owner.save();
		return res.send("Success");
	} catch (err) {
		return res.json({ message: "Error", error: err.message });
	}
};

export const loginTheaterOwner = async (req, res) => {
	const { username, password } = req.body;

	try {
		const theaterowner = await TheaterOwner.findOne({
			username: username,
		});
		if (!theaterowner || theaterowner.deleted || theaterowner.blocked) {
			throw new Error("Invalid Theater Owner Credentials-TON");
		} else {
			const passwordMatch = await bcrypt.compare(
				password,
				theaterowner.passwordHash
			);
			if (!passwordMatch) {
				throw new Error("Invalid Theater Owner Credentials");
			} else {
				const token = createToken({
					userId: theaterowner.userId,
					username: username,
					role: theaterowner.role,
					id: theaterowner._id,
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
		res.status(403).json({
			error: "Login Failed",
			message: err.message,
		});
	}
};
export const resetTheaterOwnerPassword = async (req, res, next) => {
	const { ownerid } = req.params;

	if (req.user.role !== "Admin" && req.user.loggedUserId !== ownerid)
		return res.status(403).json({
			error: "Authorization Error",
			message: "You are not authorized to reset Password",
		});
	try {
		const { newPassword } = req.body;

		const newPasswordHash = await bcrypt.hash(newPassword, 10);

		const theaterowner = await TheaterOwner.findByIdAndUpdate(
			req.user.loggedUserObjectId,
			{ passwordHash: newPasswordHash },
			{ new: true }
		);

		res.status(201).json("Password Reset");
	} catch (err) {
		res
			.status(500)
			.json({ error: "Unable to Reset Password", message: err.message });
	}
};

export const deleteTheaterOwner = async (req, res, next) => {
	const { ownerid } = req.params;

	if (req.user.role !== "Admin" && req.user.loggedUserId !== ownerid)
		return res.status(403).json({
			error: "Authorization Error",
			message: "You are not authorized to delete this account",
		});
	try {
		const theaterowner = await TheaterOwner.findOne({ userId: ownerid });
		if (!theaterowner || theaterowner.deleted) {
			return res
				.status(404)
				.json("This account doesn't exist or is already deleted");
		} else {
			handleTheaterOwnerDeletion(ownerid);
			if (req.user.role !== "Admin")
				return res.status(204).clearCookie("token").json("Account Deleted");
			res.status(204).json("Account Deleted");
		}
	} catch (err) {
		res
			.status(500)
			.json({ error: "Unable to delete account", message: err.message });
	}
};

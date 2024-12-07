import { TheaterOwner } from "../models/TheaterOwner.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/createToken.js";
import { uploadDisplayImage } from "../utils/cloudinaryUpload.js";
import { handleTheaterOwnerDeletion } from "../utils/deleteCascadeManager.js";
import HandleError from "../middleware/errorHandling.js";

export const viewTheaterOwners = async (req, res, next) => {
	const { active } = req.query;
	const { filter, page = 1, limit = 10 } = req.query;
	let filterCondition = {};
	if (active) {
		filterCondition = { deleted: false, blocked: false };
	}
	// active ? {fi}

	try {
		if (req.query.page && req.query.limit) {
			const skip = (page - 1) * limit;
			const owners = await TheaterOwner.find()
				.select("userId username displayImage")
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit);
			const totalOwners = await TheaterOwner.countDocuments();

			res.status(200).json({
				owners,
				totalOwners,
				totalPages: Math.ceil(totalOwners / limit),
				currentPage: page,
			});
		} else {
			const owners = await TheaterOwner.find(filterCondition).select(
				"-passwordHash"
			);
			res.status(200).json(owners);
		}
	} catch (err) {
		return res
			.status(err?.statusCode || 500)
			.json({ message: "Error", error: err?.message });
	}
};

export const viewTheaterOwnerProfile = async (req, res, next) => {
	const { ownerid } = req.params;

	try {
		if (req.user.role !== "Admin" && req.user.loggedUserId !== ownerid)
			throw new HandleError("You are not authorized to see this page", 403);
		const owner = await TheaterOwner.findOne({ userId: ownerid }).select(
			"-passwordHash"
		);
		if (!owner) throw new HandleError("No Such Theater", 404);
		res.status(200).json(owner);
	} catch (err) {
		return res
			.status(err?.statusCode || 500)
			.json({ message: "Error", error: err?.message });
	}
};

export const updateTheaterOwnerProfile = async (req, res, next) => {
	const { ownerid } = req.params;

	if (req.user.role !== "Admin" && req.user.loggedUserId !== ownerid) {
		throw new HandleError("You are not authorized to see this page", 403);
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
			.status(err?.statusCode || 500)
			.json({ error: "Unable to update profile", message: err?.message });
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
		return res.status(200).send("Success");
	} catch (err) {
		return res
			.status(err?.statusCode || 500)
			.json({ message: "Error", error: err?.message });
	}
};

export const loginTheaterOwner = async (req, res) => {
	const { username, password } = req.body;

	try {
		const theaterowner = await TheaterOwner.findOne({
			username: username,
		});
		if (!theaterowner || theaterowner.deleted || theaterowner.blocked) {
			throw new HandleError("Invalid User Credentials", 403);
		} else {
			const passwordMatch = await bcrypt.compare(
				password,
				theaterowner.passwordHash
			);
			if (!passwordMatch) {
				throw new HandleError("Invalid User Credentials", 403);
			} else {
				const token = createToken({
					userId: theaterowner.userId,
					username: username,
					displayImage: theaterowner.displayImage,
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
		res.status(err?.statusCode || 500).json({
			error: "Login Failed",
			message: err?.message,
		});
	}
};
export const resetTheaterOwnerPassword = async (req, res, next) => {
	const { ownerid } = req.params;

	if (req.user.role !== "Admin" && req.user.loggedUserId !== ownerid)
		throw new HandleError("You are not authorized to reset password", 403);
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
			.status(err?.statusCode || 500)
			.json({ error: "Unable to Reset Password", message: err?.message });
	}
};

export const deleteTheaterOwner = async (req, res, next) => {
	const { ownerid } = req.params;

	if (req.user.role !== "Admin" && req.user.loggedUserId !== ownerid)
		throw new HandleError("You are not authorized to delete this user", 403);
	try {
		const theaterowner = await TheaterOwner.findOne({ userId: ownerid });
		if (!theaterowner || theaterowner.deleted) {
			throw new HandleError(
				"This user doesn't exist or is already deleted",
				404
			);
		} else {
			handleTheaterOwnerDeletion(ownerid);
			if (req.user.role !== "Admin")
				return res
					.status(204)
					.clearCookie("token", {
						expires: new Date(Date.now() + 6 * 60 * 60 * 1000),
						sameSite: "none",
						secure: true,
						httpOnly: true,
					})
					.json("Account Deleted");
			res.status(204).json("Account Deleted");
		}
	} catch (err) {
		res
			.status(err?.statusCode || 500)
			.json({ error: "Unable to delete account", message: err?.message });
	}
};

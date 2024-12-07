import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/createToken.js";
import HandleError from "../middleware/errorHandling.js";
import { uploadDisplayImage } from "../utils/cloudinaryUpload.js";

export const viewUsers = async (req, res, next) => {
	const { filter, page = 1, limit = 10 } = req.query;

	try {
		if (req.query.page && req.query.limit) {
			const skip = (page - 1) * limit;
			const users = await User.find()
				.select("userId username displayImage")
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit);
			const totalUsers = await User.countDocuments();

			res.status(200).json({
				users,
				totalUsers,
				totalPages: Math.ceil(totalUsers / limit),
				currentPage: page,
			});
		} else {
			const users = await User.find().lean().select("userId username");
			res.status(200).json(users);
		}
	} catch (err) {
		return res
			.status(err?.statusCode || 500)
			.json({ message: "Error", error: err?.message });
	}
};

export const viewUserProfile = async (req, res, next) => {
	const { userid } = req.params;

	if (req.user.role !== "Admin" && req.user.loggedUserId !== userid)
		return res.status(403).json({
			error: "Authorization Error",
			message: "You are not authorized to see this page",
		});

	try {
		const user = await User.findOne({ userId: userid }).select("-passwordHash");
		if (!user) throw new HandleError("No such user exists", 404);
		res.status(200).json(user);
	} catch (err) {
		return res
			.status(err?.statusCode || 500)
			.json({ message: "Error", error: err?.message });
	}
};

export const updateUserProfile = async (req, res, next) => {
	const { userid } = req.params;

	if (req.user.role !== "Admin" && req.user.loggedUserId !== userid)
		throw new HandleError("You are not authorized to update this profile", 403);

	try {
		const { mobile, email, moviePreferences } = req.body;
		const image = req.file;
		let displayImage;
		if (image) {
			displayImage = await uploadDisplayImage(image);
		}

		const user = await User.findOneAndUpdate(
			{ userId: userid },
			{
				mobile,
				email,
				moviePreferences,
				displayImage: displayImage,
			},
			{ runValidators: true, new: true }
		);

		res.status(201).json({ message: "Profile updated", user: user });
	} catch (err) {
		res
			.status(err?.statusCode || 500)
			.json({ error: "Unable to update profile", message: err?.message });
	}
};

export const registerUser = async (req, res, next) => {
	const { username, email, mobile, password, moviePreferences } = req.body;
	// Check for existing User;
	try {
		const passwordHash = await bcrypt.hash(password, 10);
		let user = await User.findOne({ username });
		if (user) {
			throw new HandleError("Username already exists. Try again", 401);
		}
		user = new User({
			username,
			email,
			mobile,
			passwordHash,
			moviePreferences,
			displayImage:
				"https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg?s=612x612&w=0&k=20&c=UEa7oHoOL30ynvmJzSCIPrwwopJdfqzBs0q69ezQoM8=",
		});
		await user.save();
		return res.status(200).send("Success");
	} catch (err) {
		return res
			.status(err?.statusCode || 500)
			.json({ message: "Error", error: err?.message });
	}
};

export const loginUser = async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ username: username });

		if (!user || user.deleted || user.blocked) {
			throw new HandleError("Invalid User Credentials", 403);
		} else {
			const passwordMatch = await bcrypt.compare(password, user.passwordHash);
			if (!passwordMatch) {
				throw new HandleError("Invalid User Credentials", 403);
			} else {
				const token = createToken({
					userId: user.userId,
					username: username,
					displayImage: user.displayImage,
					role: user.role,
					id: user._id,
				});

				res.cookie("token", token, {
					expires: new Date(Date.now() + 6 * 60 * 60 * 1000),

					secure: process.env.NODE_ENV === "production",
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

export const resetUserPassword = async (req, res, next) => {
	const { userid } = req.params;

	if (req.user.role !== "Admin" && req.user.loggedUserId !== userid)
		throw new HandleError("You are not authorized to reset Password", 403);

	try {
		const { newPassword } = req.body;

		const newPasswordHash = await bcrypt.hash(newPassword, 10);

		const user = await User.findByIdAndUpdate(
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

export const deleteUser = async (req, res, next) => {
	const { userid } = req.params;

	if (req.user.role !== "Admin" && req.user.loggedUserId !== userid)
		throw new HandleError("You are not authorized to delete this account", 403);

	try {
		const user = await User.findOne({ userId: userid });
		if (!user || user.deleted)
			throw new HandleError(
				"This account doesn't exist or is already deleted",
				404
			);
		else {
			await User.findOneAndUpdate(
				{ userId: userid },
				{ deleted: true },
				{ new: true }
			);

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

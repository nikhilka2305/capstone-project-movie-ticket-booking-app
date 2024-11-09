import { TheaterOwner } from "../models/TheaterOwner.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/createToken.js";

export const viewTheaterOwners = async (req, res, next) => {
	console.log(req.user);

	try {
		const owners = await TheaterOwner.find().select("-passwordHash");
		res.json(owners);
	} catch (err) {
		console.log("Unable to get Theater Owner");
		console.log(err.message);
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
		const owner = await TheaterOwner.findOne({ ownerId: ownerid }).select(
			"-passwordHash"
		);
		if (!owner) throw new Error("No such theater owner exists");
		res.status(200).json(owner);
	} catch (err) {
		console.log("Unable to get theater owner Data");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};

export const updateTheaterOwnerProfile = async (req, res, next) => {
	const { ownerid } = req.params;

	if (req.user.role !== "Admin" && req.user.loggedUserId !== ownerid)
		return res.status(403).json({
			error: "Authorization Error",
			message: "You are not authorized to see this page",
		});

	/*
		
		Update Theater Owner Profile Logic

		*/

	return res.send("Update Theater Owner Profile page works");
};

export const registerTheaterOwner = async (req, res, next) => {
	const { theaterownername, email, mobile, password } = req.body;
	console.log(req.body);
	const passwordHash = await bcrypt.hash(password, 10);
	try {
		const owner = new TheaterOwner({
			theaterownername,
			email,
			mobile,
			passwordHash,
		});
		await owner.save();
		return res.send("Success");
	} catch (err) {
		console.log("Unable to save Theater Owner");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};

export const loginTheaterOwner = async (req, res) => {
	const { theaterownername, password } = req.body;

	try {
		const theaterowner = await TheaterOwner.findOne({
			theaterownername: theaterownername,
		});
		if (!theaterowner) {
			throw new Error("Invalid Theater Owner Credentials-TON");
		} else {
			const passwordMatch = await bcrypt.compare(
				password,
				theaterowner.passwordHash
			);
			if (!passwordMatch) {
				throw new Error("Invalid Theater Owner Credentials");
			} else {
				console.log(theaterowner);
				const token = createToken({
					ownerId: theaterowner.ownerId,
					theaterownername: theaterownername,
					role: theaterowner.role,
					id: theaterowner._id,
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

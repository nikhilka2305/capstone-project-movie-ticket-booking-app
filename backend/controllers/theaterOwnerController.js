import { TheaterOwner } from "../models/TheaterOwner.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const viewTheaterOwners = async (req, res, next) => {
	console.log(req.user);
	if (req.user.role !== "Admin")
		res.status(403).json({
			error: "Authorization Error",
			message: "You are not authorized to see this page",
		});
	else {
		try {
			const owners = await TheaterOwner.find();
			res.json(owners);
		} catch (err) {
			console.log("Unable to get Theater Owner");
			console.log(err.message);
			return res.json({ message: "Error", error: err.message });
		}
	}
};

export const registerTheaterOwner = async (req, res, next) => {
	const { theaterownername, email, password } = req.body;

	const passwordHash = await bcrypt.hash(password, 10);
	try {
		const owner = new TheaterOwner({
			theaterownername,
			email,
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
				const token = jwt.sign(
					{
						ownerId: theaterowner.ownerId,
						theaterownername: theaterownername,
						role: theaterowner.role,
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

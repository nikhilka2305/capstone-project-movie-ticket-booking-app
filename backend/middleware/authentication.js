import jwt from "jsonwebtoken";
import HandleError from "./errorHandling.js";

export const authenticateToken = (req, res, next) => {
	try {
		const token = req.cookies.token;

		if (!token) {
			throw new HandleError("You need to login to proceed", 403);
		}

		jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, user) => {
			if (err) {
				return res.status(401).json({ message: "Invalid Token" });
			}

			req.user = {
				loggedUserId: user.userId,
				loggedUserObjectId: user.id,
				loggedUserName: user.username,
				role: user.role,
				loggedUserDisplayImage: user.displayImage,
			};
			next();
		});
	} catch (err) {
		res.status(err?.statusCode).json({ message: err?.message });
	}
};

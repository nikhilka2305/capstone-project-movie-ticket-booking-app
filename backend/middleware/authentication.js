import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (!token)
		return res.status(403).json({ message: "You need to login to proceed" });
	jwt.verify(token, process.env.JWT_ACCESS_TOKEN_COMMON_SECRET, (err, user) => {
		if (err) {
			console.log("User validation failed");
			return res.status(401).json({ message: "Invalid Token" });
		}
		console.log("User validated");
		console.log(user);
		req.user = {
			loggedUserId: user.adminId || user.userId || user.ownerId,
			loggedUserName: user.adminname || user.username || user.theaterownername,
			role: user.role,
		};
		next();
	});
};

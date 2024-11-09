import jwt from "jsonwebtoken";
export const createToken = (userData) => {
	const token = jwt.sign(userData, process.env.JWT_ACCESS_TOKEN_COMMON_SECRET, {
		expiresIn: "6h",
	});
	return token;
};

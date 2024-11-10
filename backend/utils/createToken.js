import jwt from "jsonwebtoken";
export const createToken = (userData) => {
	const token = jwt.sign(userData, process.env.JWT_ACCESS_TOKEN, {
		expiresIn: "6h",
	});
	return token;
};

export const logout = (req, res, next) => {
	return res
		.status(204)
		.clearCookie("token")
		.json({ message: "Succesfully Logged Out" });
};

export const checkAuth = (req, res, next) => {
	return res
		.status(200)
		.json(`Succesfully authenticated & authorized as ${req.user.role}`);
};

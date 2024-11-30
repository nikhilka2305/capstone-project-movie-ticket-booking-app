export const logout = (req, res, next) => {
	return res
		.status(204)
		.clearCookie("token", {
			expires: new Date(Date.now() + 6 * 60 * 60 * 1000),
			sameSite: "none",
			secure: true,
			httpOnly: true,
		})
		.json({ message: "Succesfully Logged Out" });
};

export const checkAuth = (req, res, next) => {
	return res
		.status(200)
		.json({ message: "Successfully Authorized", user: req.user });
};

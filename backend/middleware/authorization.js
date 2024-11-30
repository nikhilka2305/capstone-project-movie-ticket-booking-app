export const authorization = function () {
	return (req, res, next) => {
		for (let i = 0; i < arguments.length; i++) {
			if (req.user.role === arguments[i]) return next();
		}

		return res.status(403).json({
			error: "Authorization Error",
			message: "You are not authorized to see this page",
		});
	};
};

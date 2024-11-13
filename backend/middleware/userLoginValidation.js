import joi from "joi";

const loginSchema = joi
	.object({
		username: joi.string().min(5).required().messages({
			"string.min": "Username must be at least 5 characters long.",
			"any.required": "Username is required.",
		}),
		password: joi.string().min(6).required().messages({
			"string.base": "Password must be a string.",
			"any.required": "Password is required.",
		}),
	})
	.options({ abortEarly: false });

export const validateUserLogin = (req, res, next) => {
	const { error } = loginSchema.validate(req.body);

	if (error) {
		return res.status(400).json({
			error: "Validation failed",
			details: error.details.map((err) => err.message),
		});
	}

	next(); // Proceed if no errors
};

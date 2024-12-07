import joi from "joi";

const loginSchema = joi
	.object({
		username: joi.string().required().messages({
			"any.required": "Username is required.",
		}),
		password: joi.string().required().messages({
			"any.required": "Password is required.",
		}),
	})
	.options({ abortEarly: false });

export const validateUserLogin = (req, res, next) => {
	const { error } = loginSchema.validate(req.body);

	if (error) {
		return res.status(400).json({
			error: "Validation failed",
			details: error.details.map((err) => err?.message),
		});
	}

	next(); // Proceed if no errors
};

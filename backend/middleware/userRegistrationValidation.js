import joi from "joi";

const username = joi.string().min(5).required();
const email = joi.string().email().required();
const mobile = joi
	.number()
	.integer()
	.min(1000000000)
	.max(9999999999)
	.required();
const password = joi.string().required();

const userSchema = joi
	.object({
		username,
		email,
		mobile,
		moviePreferences: joi
			.object({
				genre: joi.string().min(3).max(15),
				favactors: joi.array().items(joi.string().min(5)).max(5),
			})
			.optional(),
		password: password.min(6),
	})
	.options({ abortEarly: false });

const theaterOwnerSchema = joi
	.object({
		username,
		email,
		mobile,
		password: password.min(8),
	})
	.options({ abortEarly: false });

const adminSchema = joi
	.object({
		username,
		email,
		mobile,
		password: password.min(10),
	})
	.options({ abortEarly: false });

// Validator map for roles
const validatorMap = {
	User: userSchema,
	TheaterOwner: theaterOwnerSchema,
	Admin: adminSchema,
};

// Validation middleware
export const validateUserReg = (validator) => {
	const Validator = validatorMap[validator];
	return (req, res, next) => {
		if (!Validator) {
			return res.status(400).json({ error: "Invalid role for validation" });
		}

		const { error } = Validator.validate(req.body);
		if (error) {
			return res.status(400).json({
				error: "Validation failed",
				details: error.details.map((err) => ({
					field: err.context.key,
					message: err.message,
				})),
			});
		}
		next();
	};
};

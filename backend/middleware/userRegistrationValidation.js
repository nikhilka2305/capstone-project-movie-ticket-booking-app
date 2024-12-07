import joi from "joi";

const userSchema = joi
	.object({
		username: joi.string().min(5).required(),
		email: joi.string().email().required(),
		mobile: joi.number().integer().min(1000000000).max(9999999999).required(),
		moviePreferences: joi
			.object({
				genre: joi.string().max(15).optional(),
				favactors: joi.array().items(joi.string().min(5)).max(5).optional(),
			})
			.optional(),
		password: joi.string().required().min(6),
		newPassword: joi.string().optional(),
	})
	.options({ abortEarly: false });

const theaterOwnerSchema = joi
	.object({
		username: joi.string().min(5).required(),
		email: joi.string().email().required(),
		mobile: joi.number().integer().min(1000000000).max(9999999999).required(),
		password: joi.string().required().min(6),
		newPassword: joi.string().optional(),
	})
	.options({ abortEarly: false });

const adminSchema = joi
	.object({
		username: joi.string().min(5).required(),
		email: joi.string().email().required(),
		mobile: joi.number().integer().min(1000000000).max(9999999999).required(),
		password: joi.string().required().min(6),
		newPassword: joi.string().optional(),
	})
	.options({ abortEarly: false });

// Validator map for roles
const validatorRegMap = {
	User: userSchema,
	TheaterOwner: theaterOwnerSchema,
	Admin: adminSchema,
};

// Validation middleware
export const validateUserReg = (validator) => {
	const Validator = validatorRegMap[validator];
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
					message: err?.message,
				})),
			});
		}
		next();
	};
};

// Patch Schemas
const userPatchSchema = userSchema.fork(
	[
		"username",
		"email",
		"mobile",
		"moviePreferences",
		"password",
		"newPassword",
	],
	(field) => field.optional()
);

const theaterOwnerPatchSchema = theaterOwnerSchema.fork(
	["username", "email", "mobile", "password", "newPassword"],
	(field) => field.optional()
);

const adminPatchSchema = adminSchema.fork(
	["username", "email", "mobile", "password", "newPassword"],
	(field) => field.optional()
);

const validatorPatchMap = {
	User: userPatchSchema,
	TheaterOwner: theaterOwnerPatchSchema,
	Admin: adminPatchSchema,
};

export const validateUserPatch = (validator) => {
	const Validator = validatorPatchMap[validator];
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
					message: err?.message,
				})),
			});
		}
		next();
	};
};

import joi from "joi";
const reviewSchema = joi
	.object({
		deleted: joi.boolean(),
		userId: joi.object({ id: joi.string().hex().length(24) }),
		userRating: joi.number().min(1).max(5).required(),
		userReview: joi.string().min(10).max(200).required(),
	})
	.options({ abortEarly: false });

const reviewPatchSchema = reviewSchema
	.fork(["deleted", "userId", "userRating", "userReview"], (field) =>
		field.optional()
	)
	.options({ abortEarly: false });

const validatorMap = {
	Add: reviewSchema,
	Patch: reviewPatchSchema,
};

export const validateReview = (validator) => {
	const Validator = validatorMap[validator];
	return (req, res, next) => {
		if (!Validator) {
			return res.status(400).json({ error: "Invalid type of validation" });
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

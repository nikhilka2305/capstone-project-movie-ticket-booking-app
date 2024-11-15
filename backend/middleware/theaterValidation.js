import joi from "joi";
const theaterstatus = ["Pending", "Approved", "Rejected", "Deleted"];
const theaterSchema = joi
	.object({
		theaterName: joi.string().min(5).required().messages({
			"string.min": "Movie Name must be at least 5 characters long.",
			"any.required": "Movie Name is required.",
		}),
		adminApprovalStatus: joi.string().valid(...theaterstatus),
		location: joi.string().min(5).required(),
		owner: joi.object({ id: joi.string().hex().length(24) }),
		seats: joi
			.object({
				rows: joi.number().min(5).required(),
				seatsPerRow: joi.number().min(5).required(),
			})
			.required(),
		seatClasses: joi
			.array()
			.items(
				joi
					.object({
						className: joi.string().min(1).required(),
						price: joi.number().min(0).required(),
					})
					.min(1)
					.max(5)
			)
			.required(),
		amenities: joi.object({
			parking: joi.string(),
			restroom: joi.string(),
			foodCounters: joi.string(),
		}),
	})
	.options({ abortEarly: false });

const theaterPatchSchema = theaterSchema
	.fork(
		[
			"theaterName",
			"adminApprovalStatus",
			"location",
			"owner",
			"seats",
			"seatClasses",
			"amenities",
		],
		(field) => field.optional()
	)
	.options({ abortEarly: false });

const validatorMap = {
	Add: theaterSchema,
	Patch: theaterPatchSchema,
};

export const validateTheater = (validator) => {
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
					message: err.message,
				})),
			});
		}
		next();
	};
};

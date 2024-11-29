import joi from "joi";
import joidate from "@joi/date";
const moviestatus = ["Pending", "Approved", "Rejected", "Deleted"];
const ratings = ["R", "U/A", "U", "A"];
const movieSchema = joi
	.object({
		movieName: joi.string().min(5).required().messages({
			"string.min": "Movie Name must be at least 5 characters long.",
			"any.required": "Movie Name is required.",
		}),
		adminApprovalStatus: joi.string().valid(...moviestatus),
		releaseDate: joi.extend(joidate).date().format("YYYY-MM-DD").required(),
		movieduration: joi.number().required().min(30).max(240),
		language: joi.string().required(),
		genre: joi.string().required(),
		rating: joi.string().valid(...ratings),
		movieDescription: joi.string().required().min(20).max(300),
		movieCast: joi.array().items(joi.string().min(5)).max(10),
		director: joi.string().required().min(4),
		// posterImage: joi.any().required(),
	})
	.options({ abortEarly: false });

const moviePatchSchema = movieSchema
	.fork(
		[
			"movieName",
			"adminApprovalStatus",
			"releaseDate",
			"movieduration",
			"language",
			"genre",
			"rating",
			"movieDescription",
			"movieCast",
			"director",
			// "posterImage",
		],
		(field) => field.optional()
	)
	.options({ abortEarly: false });

const validatorMap = {
	Add: movieSchema,
	Patch: moviePatchSchema,
};
export const validateMovie = (validator) => {
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

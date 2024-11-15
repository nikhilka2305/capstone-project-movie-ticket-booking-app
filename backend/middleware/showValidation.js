// @ts-ignore
import joi from "joi";
import joiObjId from "joi-objectid";

const joiobjectid = joiObjId(joi);

const showSchema = joi
	.object({
		deleted: joi.boolean(),
		showTime: joi.date().iso().greater("now"),
		bookedSeats: joi.array().items({
			seatNumber: joi.object({
				row: joi.number().required().min(1),
				col: joi.number().required().min(1),
			}),
		}),
		movie: joiobjectid().required(),
	})
	.options({ abortEarly: false });

const showPatchSchema = showSchema
	.fork(["deleted", "showTime", "bookedSeats", "movie"], (field) =>
		field.optional()
	)
	.options({ abortEarly: false });

const validatorMap = {
	Add: showSchema,
	Patch: showPatchSchema,
};

export const validateShow = (validator) => {
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

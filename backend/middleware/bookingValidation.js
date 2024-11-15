import joi from "joi";
import joiObjId from "joi-objectid";
const joiobjectid = joiObjId(joi);

const bookingSchema = joi
	.object({
		showInfo: joiobjectid().required(),
		seats: joi
			.array()
			.min(1)
			.required()
			.items(
				joi.object({
					seatNumber: joi
						.object({
							row: joi.number().min(1).required(),
							col: joi.number().min(1).required(),
						})
						.required(),
					seatClass: joi
						.object({
							className: joi.string().min(1).required(),
							price: joi.number().min(0).required(),
						})
						.required(),
				})
			),
	})
	.options({ abortEarly: false });

export const validateBooking = (req, res, next) => {
	const { error } = bookingSchema.validate(req.body);
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

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const makePayment = async (req, res) => {
	const { bookingData } = req.body;

	const lineItems = bookingData.displaySeatInfo.map((item) => ({
		price_data: {
			currency: "inr",
			product_data: {
				name: `${item?.seatNumber}  - (${item?.seatClass?.className})`,
				images: [item?.image],
			},
			unit_amount: item.seatClass.price * 100,
		},
		quantity: 1,
	}));

	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"], // Specify payment methods
			line_items: lineItems,
			mode: "payment",
			metadata: {
				bookingInfo: JSON.stringify(bookingData.bookingInfo),
			},
			success_url: `${process.env.CORS_DOMAIN}/paymentsuccess?sessionId={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CORS_DOMAIN}/paymentfailed`,
		});

		res.status(200).json({ success: true, sessionId: session.id });
	} catch (err) {
		res
			.status(err?.statusCode || 500)
			.json({ message: err?.message || "Internal Server Error" });
	}
};

const getSessionData = async (req, res, next) => {
	try {
		const sessionId = req.query.sessionId;
		const session = await stripe.checkout.sessions.retrieve(sessionId, {
			expand: ["line_items"],
		});

		res.status(200).json({
			success: true,
			bookinginfo: JSON.parse(session.metadata.bookingInfo),
			line_items: session.line_items.data,
		});
	} catch (err) {
		res
			.status(err?.statusCode || 500)
			.json({ message: err?.message || "Internal Server Error" });
	}
};

export { makePayment as makePayment };
export { getSessionData as getSessionData };

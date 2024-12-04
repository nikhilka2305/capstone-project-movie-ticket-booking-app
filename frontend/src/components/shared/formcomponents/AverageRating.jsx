import React from "react";

export default function AverageRating({ rating, ratingSize = "rating-sm" }) {
	const roundedrating = Math.round(rating * 2) / 2;
	return (
		<div className={`${ratingSize} rating rating-half`}>
			<input
				type="radio"
				name="avgRating"
				value={0}
				className="rating-hidden"
			/>
			<input
				type="radio"
				name="avgRating"
				value={0.5}
				checked={roundedrating === 0.5}
				className="mask mask-star-2 mask-half-1 bg-green-500"
				readOnly
			/>
			<input
				type="radio"
				name="avgRating"
				value={1}
				checked={roundedrating === 1}
				className="mask mask-star-2 mask-half-2 bg-green-500"
				readOnly
			/>
			<input
				type="radio"
				name="avgRating"
				value={1.5}
				checked={roundedrating === 1.5}
				className="mask mask-star-2 mask-half-1 bg-green-500"
				readOnly
			/>
			<input
				type="radio"
				name="avgRating"
				value={2}
				checked={roundedrating === 2}
				className="mask mask-star-2 mask-half-2 bg-green-500"
				readOnly
			/>
			<input
				type="radio"
				name="avgRating"
				value={2.5}
				checked={roundedrating === 2.5}
				className="mask mask-star-2 mask-half-1 bg-green-500"
				readOnly
			/>
			<input
				type="radio"
				name="avgRating"
				value={3}
				checked={roundedrating === 3}
				className="mask mask-star-2 mask-half-2 bg-green-500"
				readOnly
			/>
			<input
				type="radio"
				name="avgRating"
				value={3.5}
				checked={roundedrating === 3.5}
				className="mask mask-star-2 mask-half-1 bg-green-500"
				readOnly
			/>
			<input
				type="radio"
				name="avgRating"
				value={4}
				checked={roundedrating === 4}
				className="mask mask-star-2 mask-half-2 bg-green-500"
				readOnly
			/>
			<input
				type="radio"
				name="avgRating"
				value={4.5}
				checked={roundedrating === 4.5}
				className="mask mask-star-2 mask-half-1 bg-green-500"
				readOnly
			/>
			<input
				type="radio"
				name="avgRating"
				value={5}
				checked={roundedrating === 5}
				className="mask mask-star-2 mask-half-2 bg-green-500"
				readOnly
			/>
		</div>
	);
}

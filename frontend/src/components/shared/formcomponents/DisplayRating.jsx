import React from "react";

export default function DisplayRating({
	rating,
	ratingSize = "rating-sm",
	reviewId,
}) {
	// const roundedrating = Math.round(rating * 2) / 2;
	// console.log(roundedrating);
	// console.log(typeof roundedrating, roundedrating);
	return (
		<div className={`${ratingSize} rating rating-half`}>
			<input
				type="radio"
				name={`avgRating-${reviewId}`}
				value={0}
				className="rating-hidden"
			/>
			<input
				type="radio"
				name="avgRating"
				value={0.5}
				checked={rating === 0.5}
				className="mask mask-star-2 mask-half-1 bg-green-500"
				readOnly
			/>
			<input
				type="radio"
				name={`avgRating-${reviewId}`}
				value={1}
				checked={rating === 1}
				className="mask mask-star-2 mask-half-2 bg-green-500"
				readOnly
			/>
			<input
				type="radio"
				name="avgRating"
				value={1.5}
				checked={rating === 1.5}
				className="mask mask-star-2 mask-half-1 bg-green-500"
				readOnly
			/>
			<input
				type="radio"
				name={`avgRating-${reviewId}`}
				value={2}
				checked={rating === 2}
				className="mask mask-star-2 mask-half-2 bg-green-500"
				readOnly
			/>
			<input
				type="radio"
				name="avgRating"
				value={2.5}
				checked={rating === 2.5}
				className="mask mask-star-2 mask-half-1 bg-green-500"
				readOnly
			/>
			<input
				type="radio"
				name={`avgRating-${reviewId}`}
				value={3}
				checked={rating === 3}
				className="mask mask-star-2 mask-half-2 bg-green-500"
				readOnly
			/>
			<input
				type="radio"
				name="avgRating"
				value={3.5}
				checked={rating === 3.5}
				className="mask mask-star-2 mask-half-1 bg-green-500"
				readOnly
			/>
			<input
				type="radio"
				name={`avgRating-${reviewId}`}
				value={4}
				checked={rating === 4}
				className="mask mask-star-2 mask-half-2 bg-green-500"
				readOnly
			/>
			<input
				type="radio"
				name="avgRating"
				value={4.5}
				checked={rating === 4.5}
				className="mask mask-star-2 mask-half-1 bg-green-500"
				readOnly
			/>
			<input
				type="radio"
				name={`avgRating-${reviewId}`}
				value={5}
				checked={rating === 5}
				className="mask mask-star-2 mask-half-2 bg-green-500"
				readOnly
			/>
		</div>
	);
}

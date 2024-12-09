import { forwardRef, useEffect } from "react";

const Rating = forwardRef(
	(
		{
			label,
			value = 0,
			onChange,
			name,
			readOnly = false,
			ratingSize = "rating-lg",
		},
		ref
	) => {
		return (
			<div className="flex justify-center px-8">
				{label && (
					<label className="input flex  items-center gap-2 w-full">
						{label}
					</label>
				)}
				<div className={`rating ${ratingSize}`}>
					<input
						type="radio"
						name={name}
						value={1}
						className="mask mask-star-2 bg-orange-400"
						ref={ref}
						checked={value === 1}
						onChange={
							!readOnly ? (e) => onChange(Number(e.target.value)) : undefined
						}
					/>
					<input
						type="radio"
						name={name}
						value={2}
						className="mask mask-star-2 bg-orange-400"
						ref={ref}
						checked={value === 2}
						onChange={
							!readOnly ? (e) => onChange(Number(e.target.value)) : undefined
						}
					/>
					<input
						type="radio"
						name={name}
						value={3}
						className="mask mask-star-2 bg-orange-400"
						ref={ref}
						checked={value === 3}
						onChange={
							!readOnly ? (e) => onChange(Number(e.target.value)) : undefined
						}
					/>
					<input
						type="radio"
						name={name}
						value={4}
						className="mask mask-star-2 bg-orange-400"
						ref={ref}
						checked={value === 4}
						onChange={
							!readOnly ? (e) => onChange(Number(e.target.value)) : undefined
						}
					/>
					<input
						type="radio"
						name={name}
						value={5}
						className="mask mask-star-2 bg-orange-400"
						ref={ref}
						checked={value === 5}
						onChange={
							!readOnly ? (e) => onChange(Number(e.target.value)) : undefined
						}
					/>
				</div>
			</div>
		);
	}
);

export default Rating;

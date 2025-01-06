import { useEffect } from "react";

export default function Input({
	type,
	name,
	id,
	label,
	required = false,
	innerRef,
	disabled = false,
	inputmode = "text",
	value,
	onChange,
	minlength,
	maxlength,
	min = "1",
	max,
	pattern,
	classes,
	register = () => {},
	validationSchema = {},
	errors,
	...props
}) {
	const handleInput = (evt) => {
		const value = type === "file" ? evt.target.files[0] : evt.target.value;
		return onChange(value);
	};
	const getNestedError = (obj, path) => {
		return path.split(".").reduce((acc, key) => acc?.[key], obj);
	};

	useEffect(() => {
		if (type === "datetime-local") {
			const currentTime = new Date();
			const oneHourFromNow = new Date(currentTime.getTime() + 60 * 60 * 1000);
			min = oneHourFromNow.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:MM
		}
	}, [type]);

	return (
		<div className="flex flex-col justify-center px-8">
			{type === "textarea" ? (
				<textarea
					name={name}
					id={id}
					placeholder={label}
					disabled={disabled ? disabled : ""}
					rows={5}
					className="py-2 pl-4 pr-2 grow w-full textarea textarea-bordered"
					value={value}
					onChange={handleInput}
					{...register(name, validationSchema)}
				></textarea>
			) : (
				<label
					htmlFor={id}
					className="input input-bordered flex  items-center gap-2 w-full"
				>
					<input
						type={type}
						inputMode={inputmode}
						name={name}
						id={id}
						placeholder={label}
						disabled={disabled ? disabled : ""}
						className={`${classes} py-2 pl-4 pr-2 grow`}
						value={value}
						onChange={handleInput}
						minLength={minlength}
						maxLength={maxlength}
						pattern={pattern}
						accept={props.fileTypes}
						multiple={props.multiple}
						min={min}
						max={max}
						ref={innerRef}
						{...register(name, validationSchema)}
					/>
				</label>
			)}
			{errors &&
				(errors[name]?.message ? (
					<span className="error mx-auto text-sm text-red-600">
						{errors[name]?.message}
					</span>
				) : (
					<>
						<span className="error mx-auto text-sm text-red-600">
							{getNestedError(errors, name)?.message}
						</span>
					</>
				))}
		</div>
	);
}

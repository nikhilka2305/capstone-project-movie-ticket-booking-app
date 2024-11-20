export default function Input({
	type,
	name,
	id,
	label,
	required = false,
	disabled = false,
	inputmode = "text",
	value,
	onChange,
	minlength,
	maxlength,
	min = "1",
	pattern,
	...props
}) {
	const handleInput = (evt) => {
		const value = type === "file" ? evt.target.files[0] : evt.target.value;
		return onChange(value);
	};

	return (
		<div className="flex justify-between px-8">
			<label htmlFor={id} className="py-2 pl-4 pr-2">
				{label}
			</label>
			{type === "textarea" ? (
				<textarea
					name={name}
					id={id}
					placeholder={label}
					required={required ? required : ""}
					disabled={disabled ? disabled : ""}
					rows={5}
					cols={40}
					className="py-2 pl-4 pr-2 rounded-md border border-slate-300 max-w-64"
					value={value}
					onChange={handleInput}
				></textarea>
			) : (
				<input
					type={type}
					inputMode={inputmode}
					name={name}
					id={id}
					placeholder={label}
					required={required ? required : ""}
					disabled={disabled ? disabled : ""}
					className="py-2 pl-4 pr-2 rounded-md border border-slate-300 max-w-64"
					value={value}
					onChange={handleInput}
					minLength={minlength}
					maxLength={maxlength}
					pattern={pattern}
					accept={props.fileTypes}
					multiple={props.multiple}
					min={min}
				/>
			)}
		</div>
	);
}

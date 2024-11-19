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
	pattern,
	...props
}) {
	const handleInput = (evt) => {
		if (type === "file") return onChange(evt.target.files[0]);
		return onChange(evt.target.value);
	};
	if (props.fileTypes) console.log(`${props.fileTypes}`);
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
					className="py-2 pl-4 pr-2 rounded-md border border-slate-300"
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
					className="py-2 pl-4 pr-2 rounded-md border border-slate-300"
					value={value}
					onChange={handleInput}
					minLength={minlength}
					maxLength={maxlength}
					pattern={pattern}
					accept={props.fileTypes}
					multiple={props.multiple}
				/>
			)}
		</div>
	);
}

import { useState } from "react";

function Select({
	label,
	field,
	selectValue,
	defaultValue,
	options,
	displayKey = null,
	valueKey = null,
	...props
}) {
	const [value, setValue] = useState(defaultValue);
	const handleChange = (evt) => {
		setValue(evt.target.value);
		selectValue(evt.target.value);
	};
	return (
		<>
			<div className="flex justify-between px-8">
				<label htmlFor={field} className="py-2 pl-4 pr-2 ">
					{label}
				</label>
				<select
					id={field}
					name={field}
					value={value}
					onChange={handleChange}
					className="py-2 pl-4 pr-2 rounded-md border border-slate-300 w-full max-w-56"
					required={props.required}
				>
					<option value="" disabled>
						-- Select {label} --
					</option>
					{options.map((option, i) => (
						<option
							key={valueKey ? option[valueKey] : i}
							value={valueKey ? option[valueKey] : option}
						>
							{displayKey ? option[displayKey] : option}
						</option>
					))}
				</select>
			</div>
		</>
	);
}

export default Select;

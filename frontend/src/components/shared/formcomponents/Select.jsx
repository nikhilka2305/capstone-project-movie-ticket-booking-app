import { useState } from "react";

function Select({ label, field, selectValue, defaultValue, options }) {
	const [value, setValue] = useState(defaultValue);
	const handleChange = (evt) => {
		setValue(evt.target.value);
		selectValue(evt.target.value);
	};
	return (
		<>
			<div className="flex justify-between px-8">
				<label htmlFor={field} className="py-2 pl-4 pr-2">
					{label}
				</label>
				<select
					id={field}
					name={field}
					value={value}
					onChange={handleChange}
					className="w-2/3"
				>
					{options.map((option, i) => (
						<option key={i} value={option}>
							{option.toUpperCase()}
						</option>
					))}
				</select>
			</div>
		</>
	);
}

export default Select;

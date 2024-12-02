import { forwardRef, useState } from "react";

const Select = forwardRef(
	(
		{
			label,
			field,
			options,
			value,
			onChange,
			errors,
			selectValue,
			defaultValue = "",
			displayKey = null,
			valueKey = null,
			...props
		},
		ref
	) => {
		return (
			<>
				<div className="flex justify-between px-8">
					<label htmlFor={field} className="py-2 pl-4 pr-2 ">
						{label}
					</label>
					<select
						id={field}
						ref={ref || null}
						name={field}
						value={value}
						onChange={(evt) => onChange?.(evt.target.value)}
						className="py-2 pl-4 pr-2 rounded-md border border-slate-300 w-full max-w-56"
						{...props}
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
				{errors && errors[field]?.message && (
					<span className="error mx-auto text-sm text-red-600">
						{errors[field]?.message}
					</span>
				)}
			</>
		);
	}
);

export default Select;

export default function Button({ label, type = "button", disabled, ...props }) {
	const colorClasses =
		props.colorClass || "bg-purple-700 hover:bg-purple-600 text-white";
	return (
		// <button className="border rounded-md bg-gray-300 py-2 px-1 w-1/3 mx-auto hover:bg-black hover:text-white ">
		<button
			disabled={disabled}
			onClick={props.onClick}
			className={`${colorClasses} py-2 px-5 md:py-3 md:px-6 font-bold text-sm md:text-base rounded-lg shadow-md transition-all duration-300 mx-auto disabled:bg-gray-500 disabled:text-black disabled:cursor-not-allowed`}
			type={type}
		>
			{label}
		</button>
	);
}

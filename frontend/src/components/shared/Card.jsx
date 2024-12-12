import Button from "./formcomponents/Button";

export default function Card({
	image = "https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg",
	title,
	subtitle,
	otherInfo,
	onClick,
	btnLabel = "Book Now",
	children,
	btndisabled = false,
}) {
	return (
		<div className="card card-side bg-slate-50 dark:bg-slate-900 w-full max-w-4xl mx-auto shadow-lg rounded-lg my-8 hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row">
			<figure className="w-full md:w-2/5 min-w-64 flex justify-center items-center overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-t-none">
				<img
					src={image}
					alt="Shoes"
					className="w-full max-w-xs h-auto object-cover transform transition-transform duration-300 hover:scale-105"
				/>
			</figure>
			<div className="card-body p-6 md:p-8">
				<h1 className="card-title text-lg md:text-xl font-semibold text-gray-600 dark:text-gray-300">
					{title}
				</h1>
				{subtitle && (
					<h3 className="text-gray-600 dark:text-gray-300 text-sm md:text-base mt-2">
						{subtitle}
					</h3>
				)}
				<div className="mt-4 text-gray-700 dark:text-gray-400">{children}</div>
				<div className="card-actions justify-end mt-6">
					<Button
						label={btnLabel}
						disabled={btndisabled ? "disabled" : ""}
						onClick={onClick}
						colorClass="bg-purple-600 hover:bg-purple-500 text-white dark:bg-purple-500 dark:hover:bg-purple-400"
					/>
				</div>
			</div>
		</div>
	);
}

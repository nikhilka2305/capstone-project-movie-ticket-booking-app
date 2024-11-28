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
		<div className="card card-side bg-base-100 w-full max-w-4xl mx-auto shadow-xl my-8 flex flex-col md:flex-row">
			<figure className="w-full md:w-2/5 min-w-64 flex justify-center items-center">
				<img
					src={image}
					alt="Shoes"
					className="w-full max-w-xs h-auto object-cover"
				/>
			</figure>
			<div className="card-body">
				<h1 className="card-title text-lg md:text-xl">{title}</h1>
				{subtitle && <h3>{subtitle}</h3>}
				{children}
				<div className="card-actions justify-end mt-4">
					<Button
						label={btnLabel}
						disabled={btndisabled ? "disabled" : ""}
						onClick={onClick}
					/>
				</div>
			</div>
		</div>
	);
}

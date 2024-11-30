import React from "react";

function BookingCard({
	image = "https://via.placeholder.com/150",
	title = "Empty",
	children,
}) {
	return (
		<div className="max-w-2xl min-w-xl mx-auto mt-8 mb-8 w-full text-wrap">
			<div className="flex gap-3  border border-gray-300 rounded-xl overflow-hidden items-center justify-start p-2">
				<div className="relative w-32 h-32 flex-shrink-0">
					<img
						className="absolute ml-4 rounded-md left-0 top-0 w-full h-full object-cover object-center transition duration-50"
						loading="lazy"
						src={image}
					/>
				</div>

				<div className="flex flex-col gap-2 p-4">
					<p className="text-lg ">{title}</p>

					<div className="text-gray-500">{children}</div>
				</div>
			</div>
		</div>
	);
}

export default BookingCard;

import React from "react";
const posterPlaceholder =
	"w-full md:w-2/5 lg:w-1/5  aspect-3/4 border rounded-sm flex items-center justify-center";
export default function Poster({ children }) {
	return (
		<div className={posterPlaceholder}>
			<img className="w-full" src={children} />
		</div>
	);
}

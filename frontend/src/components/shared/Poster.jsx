import React from "react";
import { Link } from "react-router-dom";
const posterPlaceholder =
	"w-full md:w-2/5 lg:w-1/5  aspect-3/4 border rounded-sm flex items-center justify-center";
export default function Poster({ movieid, children }) {
	return (
		<div className={posterPlaceholder}>
			<Link to={`/movies/${movieid}`}>
				<img className="w-full" src={children} />
			</Link>
		</div>
	);
}

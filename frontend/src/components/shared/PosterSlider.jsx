import { Pagination } from "./Pagination";
import Poster from "./Poster";
import PropTypes from "prop-types";
const posterSlider =
	"poster-slider flex gap-4 justify-evenly flex-wrap items-center mx-auto h-full";

export default function PosterSlider({ heading, classes, children }) {
	return (
		<article
			className={`${classes} w-full h-full mt-4 pl-2 flex flex-col justify-center gap-4 items-center`}
		>
			{heading ? <h2 className="">{heading}</h2> : ""}
			<div className={posterSlider}>{children}</div>
		</article>
	);
}
PosterSlider.propTypes = {
	heading: PropTypes.string,
	posters: PropTypes.array,
};

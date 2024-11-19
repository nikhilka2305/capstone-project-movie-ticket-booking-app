import { Pagination } from "./Pagination";
import Poster from "./Poster";
import PropTypes from "prop-types";
const posterSlider =
	"poster-slider flex gap-4 justify-evenly flex-wrap items-center mx-auto";

export default function PosterSlider({ heading, posters, classes, children }) {
	console.log(posters);
	return (
		<article
			className={`${classes} mt-4 pl-2 flex flex-col justify-center gap-4 items-center`}
		>
			{heading ? <h2 className="mb-4">{heading}</h2> : ""}
			<div className={posterSlider}>
				{posters.map((poster, i) => {
					return (
						<Poster key={i} movieid={poster.movieId}>
							{poster.posterImage}
						</Poster>
					);
				})}
			</div>
			{children}
		</article>
	);
}
PosterSlider.propTypes = {
	heading: PropTypes.string,
	posters: PropTypes.array,
};

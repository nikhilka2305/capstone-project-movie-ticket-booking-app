import { Pagination } from "./Pagination";
import Poster from "./Poster";
import PropTypes from "prop-types";
// const posterSlider = 	"poster-slider flex gap-4 justify-evenly flex-wrap items-center mx-auto h-full";
const posterSlider = `
grid 
grid-cols-1 
sm:grid-cols-2 
md:grid-cols-3 
lg:grid-cols-4 
gap-6 
place-items-center
justify-items-center
w-full
mx-auto
my-4
`;

export default function PosterSlider({ heading, classes, children }) {
	return (
		<article className={` w-full  flex flex-col  gap-4 items-center`}>
			{heading ? <h2 className="">{heading}</h2> : ""}
			<div className={posterSlider}>{children}</div>
		</article>
	);
}
PosterSlider.propTypes = {
	heading: PropTypes.string,
	posters: PropTypes.array,
};

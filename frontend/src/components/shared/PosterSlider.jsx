import Poster from "./Poster";
const posterSlider =
	"poster-slider flex gap-4 justify-evenly flex-wrap align-middle";
export default function PosterSlider({ heading, posters }) {
	console.log(posters);
	return (
		<article className="mt-4">
			{heading ? <h2 className="mb-4">{heading}</h2> : ""}
			<div className={posterSlider}>
				{posters.map((poster, i) => {
					return <Poster key={i}>{poster.posterImage}</Poster>;
				})}
			</div>
		</article>
	);
}

const posterPlaceholder =
	"   border rounded-sm flex items-center justify-center ";
export default function Poster({ url }) {
	return (
		<div className={posterPlaceholder}>
			<img className="w-full" src={url} />
		</div>
	);
}

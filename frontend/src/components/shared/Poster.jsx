export default function Poster({ url, title, description = "", ...props }) {
	return (
		<div className="card bg-base-100 w-full max-w-xs shadow-xl hover:shadow-2xl hover:bg-base-200 transition-all duration-300 group relative overflow-hidden">
			<figure className="relative">
				<img
					src={url}
					alt=""
					className="object-contain w-full h-96 transform group-hover:scale-105 transition-transform duration-300"
				/>
			</figure>
			<div className="card-body text-lg font-semibold">
				{title}
				<div className="text-white text-center px-2">
					{description}
					<br />
					<p>{props.otherInfo}</p>
				</div>
			</div>
		</div>
	);
}

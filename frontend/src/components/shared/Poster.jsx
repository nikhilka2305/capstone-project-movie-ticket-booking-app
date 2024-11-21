export default function Poster({ url, title, description = "", ...props }) {
	return (
		<div className="card bg-base-100 w-full max-w-xs shadow-xl">
			<figure>
				<img src={url} alt="" className="object-contain w-full h-96" />
			</figure>
			<div className="card-body">
				{title}
				<div>
					{description}
					<br />
					{props.otherInfo}
				</div>
			</div>
		</div>
	);
}

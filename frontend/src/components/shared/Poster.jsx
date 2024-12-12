export default function Poster({ url, title, description = "", ...props }) {
	return (
		<div className="card bg-slate-50 w-full max-w-xs shadow-xl hover:shadow-2xl hover:bg-base-200 transition-all duration-300 group relative overflow-hidden dark:bg-slate-900 dark:hover:slate-800">
			<figure className="relative">
				<img
					src={url}
					alt=""
					className="object-contain w-full h-96 transform group-hover:scale-105 transition-transform duration-300"
				/>
			</figure>
			<div className="card-body text-lg font-semibold text-slate-50 text-center">
				{title}
				<div className="text-slate-800 text-center px-2 dark:text-slate-50 text-sm">
					{description}
					<br />
					<p>{props.otherInfo}</p>
				</div>
			</div>
		</div>
	);
}

import React from "react";

function MoviePreferences({ preferenceData }) {
	return (
		<>
			<h3 className="text-lg">Movie Preference</h3>
			<p className="text-slate-500 font-medium">
				{" "}
				<b>Favourite Genre:</b>{" "}
				{preferenceData && preferenceData.genre
					? preferenceData.genre
					: "Nothing Specifically"}
			</p>
			<p>
				<b>Favourite actors:</b>{" "}
			</p>
			<ul>
				{preferenceData &&
				preferenceData.favactors &&
				preferenceData.favactors.length !== 0
					? preferenceData.favactors.map((actor, i) => (
							<li key={i} className="list-decimal">
								{actor}
							</li>
					  ))
					: "No One specifically"}
			</ul>
		</>
	);
}

export default MoviePreferences;

import React from "react";

export default function StatsComponent({
	label1,
	value1,
	label2,
	value2,
	label3,
	value3,
}) {
	return (
		<div className="stats stats-vertical lg:stats-horizontal shadow">
			<div className="stat place-items-center">
				<div className="stat-title">{label1}</div>
				<div className="stat-value text-xl">{value1}</div>
			</div>

			<div className="stat place-items-center">
				<div className="stat-title">{label2}</div>
				<div className="stat-value text-xl">{value2}</div>
			</div>

			<div className="stat place-items-center">
				<div className="stat-title">{label3}</div>
				<div className="stat-value text-xl">{value3}</div>
			</div>
		</div>
	);
}

import React from "react";

export default function StatSingleComponent({ label, value }) {
	return (
		<div className="stats shadow">
			<div className="stat place-items-center">
				<div className="stat-title">{label}</div>
				<div className="stat-value">{value}</div>
			</div>
		</div>
	);
}

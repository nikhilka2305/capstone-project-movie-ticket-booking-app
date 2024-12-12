import React from "react";
import { Link } from "react-router-dom";

export default function GoBackLink({ to, label = "Go Back" }) {
	return (
		<Link to={to} className="btn glass">
			{label}
		</Link>
	);
}

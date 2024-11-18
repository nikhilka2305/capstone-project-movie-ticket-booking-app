import { useState } from "react";

export default function Accordion({ title, children, classes }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className={classes}>
			<button onClick={() => setIsOpen(!isOpen)} type="button">
				{title}
			</button>
			{isOpen && <div>{children}</div>}
		</div>
	);
}

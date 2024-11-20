import { useState } from "react";

export default function Accordion({ title, children, classes }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className={`${classes} flex flex-col gap-8 items-between`}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				type="button"
				className="px-12"
			>
				{title}
			</button>
			{isOpen && <div>{children}</div>}
		</div>
	);
}

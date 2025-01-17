import { useState } from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export function Pagination({ page, setPage, totalPages }) {
	const [active, setActive] = useState(page);

	const getItemProps = (index) => ({
		variant: active === index ? "filled" : "text",
		color: "gray",
		onClick: () => {
			setPage(index);
			setActive(index);
		},
	});

	const next = () => {
		if (active === totalPages) return;
		setActive(active + 1);
		setPage(active + 1);
	};

	const prev = () => {
		if (active === 1) return;

		setActive(active - 1);
		setPage(active - 1);
	};
	const buttons = [];
	for (let i = 1; i <= totalPages; i++) {
		buttons.push(
			<IconButton {...getItemProps(i)} key={i} className=" dark:text-gray-100">
				{i}
			</IconButton>
		);
	}

	return (
		<div className="flex items-center gap-4 my-auto ">
			<Button
				variant="text"
				className="flex items-center gap-2"
				onClick={prev}
				disabled={active === 1}
			>
				<ArrowLeftIcon
					strokeWidth={2}
					className="h-4 w-4 text-gray-900 dark:text-gray-100"
				/>{" "}
				Previous
			</Button>
			<div className="flex items-center gap-2">{buttons}</div>
			<Button
				variant="text"
				className="flex items-center gap-2"
				onClick={next}
				disabled={totalPages === 0 || active === totalPages}
			>
				Next
				<ArrowRightIcon
					strokeWidth={2}
					className="h-4 w-4 text-gray-900 dark:text-gray-100"
				/>
			</Button>
		</div>
	);
}

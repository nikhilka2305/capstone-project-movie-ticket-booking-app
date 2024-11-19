import Button from "./formcomponents/Button";

export default function Card({ children }) {
	return (
		<section className="container mx-auto p-10 md:p-20 antialiased ">
			<article className=" flex flex-wrap md:flex-nowrap shadow-lg mx-auto max-w-3/5 items-center justify-between">
				{children}
			</article>
		</section>
	);
}

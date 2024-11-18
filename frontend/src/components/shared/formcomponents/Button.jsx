export default function Button({ label, type = "button" }) {
	return (
		<button className="border rounded-md bg-gray-300 py-2 px-1 w-1/3 mx-auto hover:bg-black hover:text-white ">
			{label}
		</button>
	);
}

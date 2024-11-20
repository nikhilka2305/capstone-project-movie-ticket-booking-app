export default function Button({ label, type = "button" }) {
	return (
		// <button className="border rounded-md bg-gray-300 py-2 px-1 w-1/3 mx-auto hover:bg-black hover:text-white ">
		<button className=" py-2 px-5 md:py-3 md:px-6 bg-purple-700 hover:bg-purple-600 font-bold text-white md:text-lg rounded-lg shadow-md mx-auto">
			{label}
		</button>
	);
}

const colorPalette = [
	"bg-blue-500 text-black",
	"bg-green-500 text-black",
	"bg-yellow-500 text-black",
	"bg-purple-500 text-black",
	"bg-pink-500 text-black",
	"bg-orange-500 text-black",
]; // Example colors

export const generateClassColors = (seatClasses) => {
	const classColors = { Unallocated: "bg-gray-300", Booked: "bg-red-500" };
	seatClasses.forEach((seatClass, index) => {
		classColors[seatClass.className] =
			colorPalette[index % colorPalette.length]; // Loop colors if needed
	});

	return classColors;
};

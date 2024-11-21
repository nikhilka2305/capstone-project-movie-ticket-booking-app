const colorPalette = [
	"bg-blue-500",
	"bg-green-500",
	"bg-yellow-500",
	"bg-purple-500",
	"bg-pink-500",
	"bg-orange-500",
]; // Example colors

export const generateClassColors = (seatClasses) => {
	const classColors = {};
	seatClasses.forEach((seatClass, index) => {
		classColors[seatClass.className] =
			colorPalette[index % colorPalette.length]; // Loop colors if needed
	});
	return classColors;
};

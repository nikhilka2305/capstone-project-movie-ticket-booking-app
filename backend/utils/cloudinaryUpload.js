import { cloudinaryInstance } from "../configs/cloudinary.js";

export const uploadDisplayImage = async (displayImage) => {
	const displayImageUrl = await cloudinaryInstance.uploader.upload(
		displayImage.path,
		{ folder: "Movie Ticket Booking Application/displayimages" }
	);
	console.log(displayImageUrl.secure_url);
	const roundImage = cloudinaryInstance.url(displayImageUrl.public_id, {
		transformation: [
			{ aspect_ratio: "1:1", gravity: "auto", width: 300, crop: "auto" },
			{ radius: "max" },
		],
		secure: true, // Ensures the URL is secure
		resource_type: "image", // Explicitly specify the resource type
	});
	console.log(roundImage);
	return roundImage;
};

export const uploadMoviePoster = async (posterImage) => {
	const posterImageUrl = await cloudinaryInstance.uploader.upload(
		posterImage.path,
		{ folder: "Movie Ticket Booking Application/posterimages" }
	);
	console.log(posterImageUrl.secure_url);
	const posterCorrectedImage = cloudinaryInstance.url(
		posterImageUrl.public_id,
		{
			transformation: [{ aspect_ratio: "2:3", width: 500, crop: "fit" }],
			secure: true, // Ensures the URL is secure
			resource_type: "image", // Explicitly specify the resource type
		}
	);
	console.log(posterCorrectedImage);
	return posterCorrectedImage;
};

export const addMultipleImages = async (images) => {
	console.log(images);
	const theaterimages = [];
	for (let image of images) {
		const img = await cloudinaryInstance.uploader.upload(image.path, {
			folder: "Movie Ticket Booking Application/theaterimages",
		});

		const theaterimage = cloudinaryInstance.url(img.public_id, {
			transformation: [{ aspect_ratio: "4:3", width: 200, crop: "fit" }],
			secure: true, // Ensures the URL is secure
			resource_type: "image", // Explicitly specify the resource type
		});

		theaterimages.push(theaterimage);
	}
	console.log(theaterimages);
	return theaterimages;
};

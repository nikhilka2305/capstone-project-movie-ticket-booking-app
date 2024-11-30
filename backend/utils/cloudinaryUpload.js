import { cloudinaryInstance } from "../configs/cloudinary.js";

export const uploadDisplayImage = async (displayImage) => {
	const displayImageUrl = await cloudinaryInstance.uploader.upload(
		displayImage.path,
		{ folder: "Movie Ticket Booking Application/displayimages" }
	);

	const roundImage = cloudinaryInstance.url(displayImageUrl.public_id, {
		transformation: [
			{ aspect_ratio: "1:1", gravity: "auto", width: 300, crop: "auto" },
			{ radius: "max" },
		],
		secure: true, // Ensures the URL is secure
		resource_type: "image", // Explicitly specify the resource type
	});

	return roundImage;
};

export const uploadMoviePoster = async (posterImage) => {
	const posterImageUrl = await cloudinaryInstance.uploader.upload(
		posterImage.path,
		{ folder: "Movie Ticket Booking Application/posterimages" }
	);

	const posterCorrectedImage = cloudinaryInstance.url(
		posterImageUrl.public_id,
		{
			transformation: [{ aspect_ratio: "2:3", width: 500, crop: "fit" }],
			secure: true, // Ensures the URL is secure
			resource_type: "image", // Explicitly specify the resource type
		}
	);

	return posterCorrectedImage;
};

export const addMultipleImages = async (images) => {
	const theaterimages = [];
	for (let image of images) {
		const img = await cloudinaryInstance.uploader.upload(image.path, {
			folder: "Movie Ticket Booking Application/theaterimages",
		});

		const theaterimage = cloudinaryInstance.url(img.public_id, {
			transformation: [{ aspect_ratio: "4:3", width: 500, crop: "fit" }],
			secure: true, // Ensures the URL is secure
			resource_type: "image", // Explicitly specify the resource type
		});

		theaterimages.push(theaterimage);
	}

	return theaterimages;
};

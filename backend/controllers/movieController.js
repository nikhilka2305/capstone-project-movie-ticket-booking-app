import { Movie } from "../models/Movie.js";

export const viewMovies = async (req, res, next) => {
	try {
		const movies = await Movie.find({ adminApproved: true });
		res.json(movies);
	} catch (err) {
		console.log("Unable to get Movies");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};

export const addMovie = async (req, res, next) => {
	const {
		movieName,
		releaseDate,
		language,
		genre,
		rating,
		movieDescription,
		movieCast,
		director,
	} = req.body;

	try {
		const movie = new Movie({
			movieName,
			releaseDate,
			language,
			genre,
			rating,
			movieDescription,
			movieCast,
			director,
		});
		await movie.save();
		return res.send("Success");
	} catch (err) {
		console.log("Unable to save Movie");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};

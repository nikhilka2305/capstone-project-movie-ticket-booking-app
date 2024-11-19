import { useState } from "react";
import Input from "../../components/shared/formcomponents/Input";
import Button from "../../components/shared/formcomponents/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "../../components/shared/formcomponents/Select";
import SelectActors from "../../components/shared/SelectActors";

export default function AddMovie() {
	const [movie, setMovie] = useState({
		movieName: "",
		releaseDate: "",
		language: "",
		movieduration: "",
		genre: "",
		rating: "",
		movieDescription: "",
		movieCast: [],
		director: "",
		posterImage: "",
	});
	const [imageFile, setImageFile] = useState(null);
	const [selectRating, setSelectRating] = useState("U/A");
	const [movieCast, setMovieCast] = useState([]);
	const navigate = useNavigate();
	const serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}/movie/addmovie`;
	const handleAddMovie = async (evt) => {
		evt.preventDefault();

		const addmovie = {
			movieName: movie.movieName,
			releaseDate: movie.releaseDate,
			language: movie.language,
			movieduration: movie.movieduration,
			genre: movie.genre,
			rating: selectRating,
			movieDescription: movie.movieDescription,
			movieCast: movieCast,
			director: movie.director,
			posterImage: imageFile,
		};

		console.log(addmovie);
		console.log(movieCast);
		if (!imageFile) throw new Error("You must include movie poster");
		const formData = new FormData();
		Object.keys(addmovie).forEach((key) => {
			if (key === "posterImage") formData.append(key, addmovie[key]);
			else if (key === "movieCast") {
				addmovie[key].forEach((actor) => {
					formData.append(`${key}[]`, actor);
				});
			} else formData.append(key, addmovie[key]);
		});

		console.log(formData);
		for (let pair of formData.entries()) {
			console.log(pair[0] + ": " + pair[1]); // Logs "name: John Doe", "age: 30"
		}

		try {
			const movieAdded = await axios.post(serverUrl, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			console.log(movieAdded);
			navigate("/movies");
		} catch (err) {
			console.log(err);
		}
	};
	const handleMovieNameChange = (value) => {
		setMovie((movie) => {
			return { ...movie, movieName: value };
		});
	};
	const handleReleaseDateChange = (value) => {
		setMovie((movie) => {
			return { ...movie, releaseDate: value };
		});
	};
	const handleLanguageChange = (value) => {
		setMovie((movie) => {
			return { ...movie, language: value };
		});
	};
	const handleGenreChange = (value) => {
		setMovie((movie) => {
			return { ...movie, genre: value };
		});
	};
	const handleDurationChange = (value) => {
		setMovie((movie) => {
			return { ...movie, movieduration: value };
		});
	};
	const handleDirectorChange = (value) => {
		setMovie((movie) => {
			return { ...movie, director: value };
		});
	};
	const handleDescriptionChange = (value) => {
		setMovie((movie) => {
			return { ...movie, movieDescription: value };
		});
	};
	const handleFileChange = (file) => {
		console.log(file);
		setImageFile(file);
	};

	return (
		<section className="mx-auto my-8 w-full lg:w-2/3 flex flex-col gap-8 ">
			<h2 className="text-center">Add New Movie</h2>

			<form
				action=""
				className="border rounded-md border-slate-900 py-8 bg-slate-200 dark:bg-slate-700 flex flex-col gap-4"
				onSubmit={handleAddMovie}
			>
				<Input
					label="Enter Movie Name"
					name="movieName"
					id="movieName"
					type="text"
					required
					value={movie.movieName}
					onChange={handleMovieNameChange}
					minlength="5"
					maxlength="15"
				/>
				<Input
					label="Enter Release Date"
					name="releasedate"
					id="releasedate"
					type="date"
					required
					value={movie.releaseDate}
					onChange={handleReleaseDateChange}
				/>
				<Input
					label="Enter Language"
					name="language"
					id="language"
					type="text"
					required
					value={movie.language}
					onChange={handleLanguageChange}
					minlength="4"
					maxlength="20"
				/>
				<Input
					label="Enter Genre"
					name="genre"
					id="genre"
					type="text"
					required
					value={movie.genre}
					onChange={handleGenreChange}
					minlength="4"
					maxlength="20"
				/>
				<Input
					label="Enter Movie Duration"
					name="movieduration"
					id="movieduration"
					type="number"
					required
					value={movie.movieduration}
					onChange={handleDurationChange}
					minlength="30"
					maxlength="240"
				/>

				<Select
					label="Enter Rating"
					field="rating"
					options={["R", "U/A", "U", "A"]}
					defaultValue="U/A"
					selectValue={setSelectRating}
				/>
				<SelectActors
					actors={movieCast}
					setActors={setMovieCast}
					minlength="5"
					maxlength="20"
					maxNumber={8}
				/>
				<Input
					label="Enter Movie Director"
					name="director"
					id="director"
					type="text"
					required
					value={movie.director}
					onChange={handleDirectorChange}
					minlength="5"
					maxlength="20"
				/>
				<Input
					label="Add Movie Description"
					name="movieDescription"
					id="movieDescription"
					type="textarea"
					required
					value={movie.movieDescription}
					onChange={handleDescriptionChange}
				/>
				<Input
					label="Add poster Image"
					name="posterImage"
					id="posterImage"
					type="file"
					required
					value={undefined}
					onChange={handleFileChange}
					fileTypes={["image/jpeg", " image/jpg", " image/png"]}
				/>

				<Button label="Submit" />
			</form>
		</section>
	);
}

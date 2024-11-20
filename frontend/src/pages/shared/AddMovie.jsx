import { useState } from "react";
import Input from "../../components/shared/formcomponents/Input";
import Button from "../../components/shared/formcomponents/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "../../components/shared/formcomponents/Select";
import SelectActors from "../../components/shared/SelectActors";
import { buildFormData } from "../../utils/manageFormData";

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
	// const [imageFile, setImageFile] = useState(null);
	// const [selectRating, setSelectRating] = useState("U/A");
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
			rating: movie.rating,
			movieDescription: movie.movieDescription,
			movieCast: movieCast,
			director: movie.director,
			posterImage: movie.posterImage,
		};
		console.log(addmovie);
		console.log(addmovie.posterImage);
		if (!addmovie.posterImage) throw new Error("You must include movie poster");

		const formData = buildFormData(addmovie, "posterImage");

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

	const handleChange = (field, value) => {
		setMovie((prev) => ({ ...prev, [field]: value }));
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
					onChange={(value) => handleChange("movieName", value)}
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
					onChange={(value) => handleChange("releaseDate", value)}
				/>
				<Input
					label="Enter Language"
					name="language"
					id="language"
					type="text"
					required
					value={movie.language}
					onChange={(value) => handleChange("language", value)}
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
					onChange={(value) => handleChange("genre", value)}
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
					onChange={(value) => handleChange("movieduration", value)}
					minlength="30"
					maxlength="240"
				/>

				<Select
					label="Enter Rating"
					field="rating"
					options={["R", "U/A", "U", "A"]}
					defaultValue="U/A"
					selectValue={(value) => handleChange("rating", value)}
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
					onChange={(value) => handleChange("director", value)}
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
					onChange={(value) => handleChange("movieDescription", value)}
				/>

				<Input
					label="Add poster Image"
					name="posterImage"
					id="posterImage"
					type="file"
					required
					value={undefined}
					onChange={(file) => handleChange("posterImage", file)}
					fileTypes={["image/jpeg", " image/jpg", " image/png"]}
				/>

				<Button label="Submit" />
			</form>
		</section>
	);
}

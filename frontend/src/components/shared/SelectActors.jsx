import { useState } from "react";
import Input from "./formcomponents/Input";

export default function SelectActors({
	actors,
	setActors,
	minlength,
	maxlength,
	maxNumber,
}) {
	{
		// const [favactors, setFavactors] = useState([]); // State to store favorite actors
		const [actor, setActor] = useState(""); // State for the current input
		const [error, setError] = useState("");

		// Handle adding a new actor
		const addActor = () => {
			if (!actor.trim()) {
				// alert("Actor name cannot be empty.");
				setError("Actor name cannot be empty.");
				return;
			}
			if (actor.trim().length < 5) {
				// alert("Actor name cannot be empty.");
				setError("Actor name is too short");
				return;
			}

			if (actors.length >= maxNumber) {
				// alert("You can only add up to 5 favorite actors.");
				setError(`You can only add up to ${maxNumber} actors.`);
				return;
			}

			if (actors.includes(actor.trim())) {
				// alert("This actor is already in the list.");
				setError("This actor is already in the list.");
				return;
			}

			setActors((prev) => [...prev, actor.trim()]); // Add the actor
			setActor(""); // Clear the input field
			setError("");
		};

		// Handle removing an actor
		const removeActor = (actorToRemove) => {
			setActors((prev) => prev.filter((a) => a !== actorToRemove));
			setError("");
		};

		return (
			<div className="py-2 flex flex-col gap-8 mt-8 items-between">
				<h2 className="pl-6 text-center">Enter Your Favorite Actors (Max 5)</h2>

				<div className="flex flex-col gap-8">
					<Input
						label="Actor Name"
						type="text"
						value={actor}
						onChange={setActor}
						minlength={minlength}
						maxlength={maxlength}
					/>
					<button
						onClick={addActor}
						type="button"
						className="border rounded-md text-blue-500 bg-gray-300 py-2 px-1 mx-8 w-1/4 ml-auto"
					>
						Add
					</button>
				</div>

				{/* Display Current List */}
				<ul className="flex gap-1 flex-wrap">
					{actors.map((a, i) => (
						<li
							key={i}
							className="border rounded-lg border-slate-500 p-2 flex justify-between items-center min-w-20"
						>
							{a}{" "}
							{/* <button onClick={() => removeActor(a)} type="button">
								
							</button> */}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="currentColor"
								className="size-4 hover:text-red-700 "
								// onClick={handleDeleteTodo}
								onClick={() => removeActor(a)}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
								/>
							</svg>
						</li>
					))}
				</ul>

				{/* Display Error for Exceeding 5 */}
				{actors.length >= maxNumber && (
					<p className="text-red-600 text-center">
						You have reached the maximum limit of 5 actors.
					</p>
				)}
				{error && <p className="text-red-600 text-center">{error}</p>}
			</div>
		);
	}
}

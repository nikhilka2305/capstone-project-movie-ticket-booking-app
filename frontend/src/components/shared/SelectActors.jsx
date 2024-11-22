import React, { useEffect, useState } from "react";

export default function SelectActors({
	name,
	register,
	setValue,
	getValues,
	errors,
	maxNumber = 5,
	validationSchema = {},
}) {
	const [localActors, setLocalActors] = useState(getValues(name) || []);
	const [actor, setActor] = useState(""); // Input state for the current actor
	const [error, setError] = useState(""); // Local error message for the input
	useEffect(() => {
		setLocalActors(getValues(name) || []);
	}, [getValues(name)]);
	// Add an actor to the list
	const addActor = () => {
		const actors = getValues(name) || []; // Get the current actors list

		// Validation checks
		if (!actor.trim()) {
			setError("Actor name cannot be empty.");
			return;
		}
		if (actor.trim().length < validationSchema.minLength?.value) {
			setError(validationSchema.minLength?.message);
			return;
		}
		if (actor.trim().length > validationSchema.maxLength?.value) {
			setError(validationSchema.maxLength?.message);
			return;
		}
		if (actors.length >= maxNumber) {
			setError(`You can only add up to ${maxNumber} actors.`);
			return;
		}
		if (actors.includes(actor.trim())) {
			setError("This actor is already in the list.");
			return;
		}

		// Update the actors array
		const updatedActors = [...actors, actor.trim()];
		setValue(name, updatedActors);
		setLocalActors(updatedActors);
		setActor(""); // Clear the input
		setError(""); // Clear the error
	};

	// Remove an actor from the list
	const removeActor = (actorToRemove) => {
		const updatedActors = getValues(name)?.filter((a) => a !== actorToRemove);
		setValue(name, updatedActors); // Update the actors list
		setLocalActors(updatedActors);
	};

	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-lg font-semibold text-center">Favorite Actors</h2>
			<div className="flex flex-col items-center gap-2 px-8">
				<input
					type="text"
					value={actor}
					onChange={(e) => setActor(e.target.value)}
					className="py-2 pl-4 pr-2 grow w-full textarea textarea-bordered"
					placeholder="Enter actor name"
				/>
				<button
					type="button"
					onClick={addActor}
					className="bg-blue-500 text-white px-4 py-2 rounded"
				>
					Add
				</button>
			</div>
			{error && <p className="text-red-600 text-sm">{error}</p>}

			{/* Display the list of actors */}
			<ul className="flex gap-1 flex-wrap pl-4 pr-2">
				{(getValues(name) || []).map((a, index) => (
					<li
						key={index}
						className="border rounded-lg border-slate-500 p-2 flex justify-between items-center min-w-20"
					>
						{a}
						<button
							type="button"
							onClick={() => removeActor(a)}
							className="text-red-500 hover:text-red-700"
						>
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
						</button>
					</li>
				))}
			</ul>

			{/* Validation error from React Hook Form */}
			{errors[name] && (
				<p className="text-red-600 text-sm">{errors[name]?.message}</p>
			)}
		</div>
	);
}

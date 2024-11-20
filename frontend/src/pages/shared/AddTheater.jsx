import { useContext, useEffect, useState } from "react";
import Input from "../../components/shared/formcomponents/Input";
import Button from "../../components/shared/formcomponents/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "../../components/shared/formcomponents/Select";
import { buildFormData } from "../../utils/manageFormData";
import { AuthContext } from "../../context/AuthContext";

function AddTheater() {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);

	const [owners, setOwners] = useState([]);
	const [loading, setLoading] = useState();
	const [theater, setTheater] = useState({
		theaterName: "",
		location: "",
		owner: "",
		seats: {
			rows: "",
			seatsPerRow: "",
		},
		seatClasses: [
			{
				className: "",
				price: "",
			},
		],
		amenities: {
			parking: "",
			restroom: "",
			foodCounters: "",
		},
		theaterimages: "",
	});
	const [feedback, setFeedback] = useState("");
	const handleChange = (field, value) => {
		setTheater((prev) => ({ ...prev, [field]: value }));
	};

	useEffect(() => {
		if (user.role === "TheaterOwner") {
			setTheater((prevTheater) => {
				return { ...prevTheater, owner: user.loggedUserObjectId };
			});
		}
		async function getOwners() {
			setLoading(true);
			const serverUrl = `${import.meta.env.VITE_SERVER_BASE_URL}/theaterowner`;

			try {
				const theaterOwners = await axios.get(serverUrl, {
					params: { active: true },
				});

				console.log(theaterOwners.data);
				setOwners(theaterOwners.data);
			} catch (err) {
				console.log(err);
			}
		}
		setLoading(false);
		getOwners();
	}, []);

	const handleNestedChange = (fieldPath, value) => {
		setTheater((prev) => {
			const updatedTheater = { ...prev };
			const keys = fieldPath.split("."); // e.g., "seats.row"
			let current = updatedTheater;

			keys.slice(0, -1).forEach((key) => {
				current[key] = { ...current[key] }; // Clone nested objects
				current = current[key];
			});

			current[keys[keys.length - 1]] = value; // Set the value
			return updatedTheater;
		});
	};

	const addSeatClass = () => {
		setTheater((prev) => ({
			...prev,
			seatClasses: [...prev.seatClasses, { className: "", price: "" }],
		}));
		setFeedback("");
	};
	const removeSeatClass = (index) => {
		setTheater((prevState) => {
			if (prevState.seatClasses.length === 1) {
				setFeedback("Atleast one seat Class is needed");
				return { ...prevState };
			}

			const updatedSeatClasses = prevState.seatClasses.filter(
				(_, i) => i !== index
			); // Remove the selected seat class
			setFeedback("");
			return { ...prevState, seatClasses: updatedSeatClasses };
		});
	};
	const handleSeatClassChange = (index, field, value) => {
		setTheater((prev) => {
			const updatedSeatClasses = [...prev.seatClasses];
			updatedSeatClasses[index] = {
				...updatedSeatClasses[index],
				[field]: value,
			};
			return { ...prev, seatClasses: updatedSeatClasses };
		});
	};
	const handleAddTheater = async (evt) => {
		evt.preventDefault();
		console.log(theater);

		const theaterFD = buildFormData(theater, "theaterimages");
		console.log(theaterFD);
		for (var pair of theaterFD.entries()) {
			console.log(pair[0] + ", " + pair[1]);
		}

		const serverUrl = `${
			import.meta.env.VITE_SERVER_BASE_URL
		}/theater/addtheater`;

		try {
			const theaterAdded = await axios.post(serverUrl, theaterFD, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			console.log(theaterAdded);
			navigate("/theaters");
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<section className="mx-auto my-8 w-full lg:w-2/3 flex flex-col gap-8 ">
			<h2 className="text-center">Add New Theater</h2>
			{loading && <p>Loading</p>}
			<form
				action=""
				className="border rounded-md border-slate-900 py-8 bg-slate-200 dark:bg-slate-700 flex flex-col gap-4"
				onSubmit={handleAddTheater}
			>
				<Input
					label="Enter Theater Name"
					name="theaterName"
					id="theaterName"
					type="text"
					required
					value={theater.theaterName}
					onChange={(value) => handleChange("theaterName", value)}
					minlength="5"
					maxlength="15"
				/>
				<Input
					label="Enter Location"
					name="location"
					id="location"
					type="text"
					required
					value={theater.location}
					onChange={(value) => handleChange("location", value)}
				/>
				{user.role === "Admin" && (
					<Select
						label="Select an Owner"
						field="owner"
						selectValue={(value) => handleChange("owner", value)}
						defaultValue={theater.owner || ""}
						options={owners} /* Need to grab from API */
						required
						displayKey="username"
						valueKey="_id"
					/>
				)}

				<Input
					label="Enter No: of Rows"
					name="row"
					id="row"
					type="number"
					required
					value={theater.seats.rows}
					onChange={(value) => handleNestedChange("seats.rows", value)}
					min="1"
				/>
				<Input
					label="Enter Seats Per Row"
					name="seatsPerRow"
					id="seatsPerRow"
					type="number"
					required
					value={theater.seats.seatsPerRow}
					onChange={(value) => handleNestedChange("seats.seatsPerRow", value)}
					min="1"
				/>
				{theater.seatClasses.map((seatClass, index) => (
					<div key={index} className="flex gap-4 items-center">
						<Input
							type="text"
							name={`seatClass-${index}`}
							id={`seatClass-${index}`}
							label="Class Name"
							value={seatClass.className}
							onChange={(value) =>
								handleSeatClassChange(index, "className", value)
							}
							required
						/>
						<Input
							type="number"
							name={`seatPrice-${index}`}
							id={`seatPrice-${index}`}
							label="Price"
							value={seatClass.price}
							onChange={(value) => handleSeatClassChange(index, "price", value)}
							required
						/>
						<button
							type="button"
							onClick={() => removeSeatClass(index)}
							className="px-4 py-2 bg-red-500 text-white rounded"
						>
							Remove
						</button>
					</div>
				))}
				{feedback && <p className="text-red-500 mt-2 mx-auto">{feedback}</p>}

				<Button
					label="Add Seat Class"
					onClick={addSeatClass}
					type="button"
					colorClass="bg-blue-500 text-white hover:bg-white hover:text-blue-500 my-4"
				/>

				<h2 className="px-12 text-2xl font-bold text-center my-4">
					Add Amenities Details
				</h2>

				<Input
					label="Enter Parking Details"
					name="parking"
					id="parking"
					type="textarea"
					required
					value={theater.amenities.parking}
					onChange={(value) => handleNestedChange("amenities.parking", value)}
					minlength="5"
					maxlength="40"
				/>
				<Input
					label="Enter Restroom Details"
					name="restroom"
					id="restroom"
					type="textarea"
					required
					value={theater.amenities.restroom}
					onChange={(value) => handleNestedChange("amenities.restroom", value)}
					minlength="5"
					maxlength="40"
				/>
				<Input
					label="Enter Food Counter Details"
					name="foodCounter"
					id="foodCounter"
					type="textarea"
					required
					value={theater.amenities.foodCounters}
					onChange={(value) =>
						handleNestedChange("amenities.foodCounters", value)
					}
					minlength="5"
					maxlength="40"
				/>

				<Input
					label="Add poster Image"
					name="theaterimages"
					id="theaterimages"
					type="file"
					required
					value={undefined}
					onChange={(file) => handleChange("theaterimages", file)}
					fileTypes={["image/jpeg", " image/jpg", " image/png"]}
					multiple
				/>

				<Button label="Submit" />
			</form>
		</section>
	);
}

export default AddTheater;

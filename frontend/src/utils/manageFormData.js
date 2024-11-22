// , fileFields = []
export const buildFormData = (data) => {
	const formData = new FormData();

	// Helper function to handle nested data
	const appendDataToFormData = (formData, path, value) => {
		if (Array.isArray(value)) {
			// If the value is an array, check if it's an array of files or other types
			value.forEach((item, index) => {
				appendDataToFormData(formData, `${path}[${index}]`, item); // Recursively call for nested items
			});
		} else if (typeof value === "object" && value !== null) {
			// If the value is an object, process its keys recursively
			Object.keys(value).forEach((key) => {
				appendDataToFormData(formData, `${path}[${key}]`, value[key]);
			});
		} else {
			// If it's a primitive value (string, number, etc.), append it directly
			formData.append(path, value);
		}
	};

	// Loop through the data object and append all fields to FormData
	Object.keys(data).forEach((key) => {
		// {if (fileFields.includes(key)) {
		// 	// Handle file fields separately
		// 	const files = data[key];
		// 	if (files) {
		// 		if (Array.isArray(files)) {
		// 			// For multiple files, append each file
		// 			files.forEach((file, index) => {
		// 				formData.append(`${key}[${index}]`, file); // Use index to maintain array-like structure
		// 			});
		// 		} else {
		// 			// If it's a single file, append it directly
		// 			formData.append(key, files);
		// 		}
		// 	}
		// } else {}
		{
			// If it's not a file field, process normally
			appendDataToFormData(formData, key, data[key]);
		}
	});

	return formData;
};

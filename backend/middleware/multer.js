import multer from "multer";
import path from "path";
import HandleError from "./errorHandling.js";
const storage = multer.diskStorage({
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

const fileFilter = (req, file, cb) => {
	const allowedFileTypes = /jpeg|jpg|png/; // Allowed file extensions
	const extname = allowedFileTypes.test(
		path.extname(file.originalname).toLowerCase()
	);
	const mimetype = allowedFileTypes.test(file.mimetype);

	if (extname && mimetype) {
		cb(null, true);
	} else {
		cb(new HandleError("Only JPG, JPEG, and PNG files are allowed!", 403));
	}
};

export const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 2, // 2 MB max file size
	},
	fileFilter: fileFilter,
});

// Needs File filtering - jpg, jpeg & png only

export const multerSingleFileHandler = function (fieldname) {
	return (req, res, next) => {
		upload.single(fieldname)(req, res, (err) => {
			if (err instanceof multer.MulterError) {
				// Multer-specific errors

				return res
					.status(err?.statusCode || 500)
					.json({ Error: "Multer Error", message: err?.message });
			} else if (err) {
				// Other errors

				return res
					.status(err?.statusCode)
					.json({ Error: "Non Multer Error", message: err?.message });
			}
			next();
		});
	};
};

export const multerMultipleFileHandler = function (fieldname, limit) {
	return (req, res, next) => {
		upload.array(fieldname, limit)(req, res, (err) => {
			if (err instanceof multer.MulterError) {
				// Multer-specific errors

				return res
					.status(500)
					.json({ Error: "Multer Error", message: err?.message });
			} else if (err) {
				// Other errors

				return res
					.status(505)
					.json({ Error: "Non Multer Error", message: err?.message });
			}
			next();
		});
	};
};

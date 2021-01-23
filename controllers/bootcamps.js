const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const BootCamp = require("../models/Bootcamp");

// @description  GET all bootcamps
// @route        GET /api/v1/bootcamps
// @access       PUBLIC
exports.getBootCamps = asyncHandler(async (req, res, next) => {
	const bootcamps = await BootCamp.find();
	res
		.status(200)
		.json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @description  GET single bootcamp
// @route        GET /api/v1/bootcamps/:id
// @access       PUBLIC
exports.getBootCamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await BootCamp.findById(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}
	res.status(200).json({ success: true, data: bootcamp });
});

// @description  CREATE new bootcamp
// @route        POST /api/v1/bootcamps/
// @access       Private
exports.createBootCamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await BootCamp.create(req.body);

	res.status(201).json({
		success: true,
		data: bootcamp,
	});
});

// @description  UPDATE a bootcamp
// @route        PUT /api/v1/bootcamps/:id
// @access       Private
exports.updateBootCamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await BootCamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}
	res.status(200).json({
		success: true,
		data: bootcamp,
	});
});

// @description  DELETE a bootcamp
// @route        DELEET /api/v1/bootcamps/:id
// @access       Private
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await BootCamp.findByIdAndDelete(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}
	res.status(200).json({
		success: true,
		data: bootcamp,
	});
});

const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const BootCamp = require("../models/Bootcamp");

// @description  GET all bootcamps
// @route        GET /api/v1/bootcamps
// @access       PUBLIC
exports.getBootCamps = asyncHandler(async (req, res, next) => {
	let query;

	// Copy req.query
	const reqQuery = { ...req.query };

	// fields to exclude
	const removeFields = ["select", "sort"];

	// Loop over remoceFields and delete them from reqQuery
	removeFields.forEach((param) => delete reqQuery[param]);

	// Buiding a query parameters string
	let queryStr = JSON.stringify(reqQuery);

	// Create  operators like ($gt, $gte, etc)
	queryStr = queryStr.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		(match) => `$${match}`
	);

	// convert back json to object
	query = JSON.parse(queryStr);

    let databaseQuery;
    
	// Finding  a resource and executing the query
	databaseQuery = BootCamp.find(query).sort("-createdAt");
	
	// select fields
	if (req.query.select) {
		const fields = req.query.select.split(",").join(" ");
		databaseQuery = databaseQuery.select(fields);
    }
  
    // Sort
	if (req.query.sort) {
		const sortBy = req.query.sort.split(",").join(" ");
		databaseQuery = databaseQuery.sort(sortBy);
    }

    const bootcamps = await databaseQuery;
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
// @route        DELETE /api/v1/bootcamps/:id
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

// @description  Get bootcamps within a radius
// @route        GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access       Private
exports.getBootCampsInRadius = asyncHandler(async (req, res, next) => {
	const { zipcode, distance } = req.params;

	//Get lat/long from geocoder
	const loc = await geocoder.geocode(zipcode);
	const latitude = loc[0].latitude;
	const longitude = loc[0].longitude;

	// calculate radius using radians
	// divide distance by radius of Earth
	// Earth radius = 3,963 mi / 6371 km

	const radius = distance / 3963;

	const bootcamps = await BootCamp.find({
		location: {
			$geoWithin: { $centerSphere: [[longitude, latitude], radius] },
		},
	});
	res.status(200).json({
		success: true,
		count: bootcamps.length,
		data: bootcamps,
	});
});

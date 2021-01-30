const path = require('path');
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const BootCamp = require("../models/Bootcamp");

// @description  GET all bootcamps
// @route        GET /api/v1/bootcamps
// @access       PUBLIC
exports.getBootCamps = asyncHandler(async (req, res, next) => { 
	res
		.status(200)
		.json(res.advancedResults);
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
	// Add user to req.body 
	req.body.user = req.user.id;


	// check for published bootcamp
	const publishedBootcamp = await BootCamp.findOne({user: req.user.id});


	// if the user is not an admin, they can anly add one bootcamp
	if(publishedBootcamp && req.user.role !== 'admin'){
		return next(
			new ErrorResponse(`The user with the id  ${req.user.id} has already published a bootamp`, 400)
		);
	}

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
	// const bootcamp = await BootCamp.findByIdAndUpdate(req.params.id, req.body, {
	// 	new: true,
	// 	runValidators: true,
	// });


	let bootcamp = await BootCamp.findById(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}

	//make sure user is the bootcamp owner (Bootcamp ownership)
	if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
		return next(
			new ErrorResponse(`User ${req.params.id} is not authorize to update this bootcamp`, 401)
		);
	}


	bootcamp = await BootCamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: bootcamp,
	});
});

// @description  DELETE a bootcamp
// @route        DELETE /api/v1/bootcamps/:id
// @access       Private
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await BootCamp.findById(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}
	//make sure user is the bootcamp owner (Bootcamp ownership)
	if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
		return next(
			new ErrorResponse(`User ${req.params.id} is not authorize to delete this bootcamp`, 401)
		);
	}
	 
   await bootcamp.remove();

	res.status(200).json({
		success: true,
		data: {},
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

// @description  upload photo for bootcamp
// @route        PUT /api/v1/bootcamps/:id/photo
// @access       Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
	const bootcamp = await BootCamp.findById(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
    }
	
	//make sure user is the bootcamp owner (Bootcamp ownership)
	if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
		return next(
			new ErrorResponse(`User ${req.params.id} is not authorize to delete this bootcamp`, 401)
		);
	}


	if(!req.files){
		return next(
			new ErrorResponse(`Please upload a file`, 400)
		);
	}

	const file = req.files.files;

	// make sure that the image is photo
	if(!file.mimetype.startsWith('image')){
		return next(
			new ErrorResponse(`Please upload an image file`, 400)
		);
	}

	// check file size
	if(file.size > process.env.MAX_FILE_UPLOAD){
		return next(
			new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400)
		);
	}

	// create custom file name;
	file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name }`, async err => {
		if(err){
			console.error(err)
				return next(
					new ErrorResponse(`Problen with file upload`, 500)
				);
		 }
		 await BootCamp.findByIdAndUpdate(req.params.id, {photo: file.name})
	})
	res.status(200).json({
		success: true, 
		data: file.name,
	});
});


const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");
const BootCamp = require("../models/Bootcamp");

// @description  GET all courses
// @route        GET /api/v1/courses
// @route        GET /api/v1/bootcamps/:bootcampId/courses
// @access       PUBLIC

exports.getCourses = asyncHandler(async (req, res, next) => {
	if (req.params.bootcampId) {
		const courses = await Course.find({ bootcamp: req.params.bootcampId });
		return res
			.status(200)
			.json({ success: true, count: courses.length, data: courses });
	} else {
		res.status(200).json(res.advancedResults);
	}
});

// @description  GET single course
// @route        GET /api/v1/courses/:id
// @access       PUBLIC

exports.getCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id).populate({
		path: "bootcamp",
		select: "name, description",
	});
	if (!course) {
		return next(
			new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
		);
	}

	res.status(200).json({ success: true, data: course });
});

// @description  Add single course
// @route        POST /api/v1/bootcamps/:bootcampId/courses
// @access       Private

exports.addCourse = asyncHandler(async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampId;
	req.body.user = req.user.id;

	const bootcamp = await BootCamp.findById(req.params.bootcampId);

	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`Bootcamp not found with id of ${req.params.bootcampId}`,
				404
			)
		);
	}

	//make sure user is the bootcamp owner (Bootcamp ownership)
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`User ${req.user.id} is not authorize to add a course to ${bootcamp._id}`,
				401
			)
		);
	}

	const course = await Course.create(req.body);

	res.status(201).json({
		success: true,
		data: course,
	});
});

// @description  Update course
// @route        POST /api/v1/courses/:id
// @access       Private

exports.updateCourse = asyncHandler(async (req, res, next) => {
	let course = await Course.findById(req.params.id);

	if (!course) {
		return next(
			new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
		);
	}
	//make sure user is the course owner (Course ownership)
	if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`User ${req.user.id} is not authorize to update course ${course._id}`,
				401
			)
		);
	}
	course = await Course.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});


	res.status(200).json({
		success: true,
		data: course,
	});
});

// @description  DELETE a course
// @route        DELETE /api/v1/courses/:id
// @access       Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id);

	if (!course) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}

	//make sure user is the course owner (Course ownership)
	if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`User ${req.user.id} is not authorize to delete course ${course._id}`,
				401
			)
		);
	}
	await course.remove();

	res.status(200).json({
		success: true,
		data: {},
	});
});

const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Review = require("../models/Review");
const BootCamp = require("../models/Bootcamp");

// @description  GET all reviews
// @route        GET /api/v1/reviews
// @route        GET /api/v1/bootcamps/:bootcampId/reviews
// @access       PUBLIC

exports.getReviews = asyncHandler(async (req, res, next) => {
	if (req.params.bootcampId) {
		const reviews = await Review.find({ bootcamp: req.params.bootcampId });
		return res
			.status(200)
			.json({ success: true, count: reviews.length, data: reviews });
	} else {
		res.status(200).json(res.advancedResults);
	}
})

// @description  GET a single reviews
// @route        GET /api/v1/reviews/:id
// @access       PUBLIC

exports.getReview = asyncHandler(async (req, res, next) => {
	const review = await Review.findById(req.params.id).populate({
		path: "bootcamp",
		select: "name description",
	});
	if (!review) {
		return next(
			new ErrorResponse(`No review  found with id of ${req.params.id}`, 404)
		);
	}

	res.status(200).json({ success: true, data: review });
})


// @description  Add  review
// @route        POST /api/v1/bootcamps/:bootcampId/reviews
// @access       PRIVATE

exports.addReview = asyncHandler(async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampId
	req.body.user = req.user.id

	const bootcamp = await BootCamp.findById(req.params.bootcampId) 

	if(!bootcamp){
		return next(
			new ErrorResponse(`No bootcamp the with id of ${req.params.bootcampId}`, 404)
		);
	}

	const review = await Review.create(req.body);

	res.status(201).json({ success: true, data: review });
})

// @description  Update  review
// @route        Put /api/v1/reviews/:Id
// @access       PRIVATE

exports.updateReview = asyncHandler(async (req, res, next) => {
	
	let review = await Review.findById(req.params.id) 

	if(!review){
		return next(
			new ErrorResponse(`No review the with id of ${req.params.id}`, 404)
		);
	}

	// make sure review belongs to user or user is admin 
	if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
		return next(
			new ErrorResponse(`Not authorize to update review`, 401)
		);
	}

	 review = await Review.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({ success: true, data: review });
})

// @description  Delete  review
// @route        DELETE /api/v1/reviews/:Id
// @access       PRIVATE

exports.deleteReview = asyncHandler(async (req, res, next) => {
	
	let review = await Review.findById(req.params.id) 

	if(!review){
		return next(
			new ErrorResponse(`No review the with id of ${req.params.id}`, 404)
		);
	}

	// make sure review belongs to user or user is admin 
	if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
		return next(
			new ErrorResponse(`Not authorize to delete review`, 401)
		);
	}

	 await Review.remove();

	res.status(200).json({ success: true, data: {} });
})
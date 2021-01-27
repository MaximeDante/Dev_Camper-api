const express = require("express");
const {
	getBootCamp,
	getBootCamps,
	createBootCamp,
	updateBootCamp,
	deleteBootCamp,
	getBootCampsInRadius, 
	bootcampPhotoUpload
} = require("../controllers/bootcamps");

const { protect, authorize } = require('../middleware/auth')

const advancedResults = require('../middleware/advancedResults');
const Bootcamp = require('../models/Bootcamp');

// include other resource routers
const courseRouter  = require('./courses');

const router = express.Router();

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

router.route('/radius/:zipcode/:distance').get(getBootCampsInRadius);  

router.route("/").get(advancedResults(Bootcamp, 'courses'), getBootCamps).post(protect, authorize('publisher', 'admin'), createBootCamp); // because they go to the same route

router.route("/:id/photo").put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

router
	.route("/:id")
	.get(getBootCamp)
	.put(protect, authorize('publisher', 'admin'), updateBootCamp)
	.delete(protect, authorize('publisher', 'admin'), deleteBootCamp);

module.exports = router;

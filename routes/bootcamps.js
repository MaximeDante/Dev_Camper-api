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
// include other resource routers
const courseRouter  = require('./courses');

const router = express.Router();

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

router.route('/radius/:zipcode/:distance').get(getBootCampsInRadius);  

router.route("/").get(getBootCamps).post(createBootCamp); // because they go to the same route

router.route("/:id/photo").put(bootcampPhotoUpload);

router
	.route("/:id")
	.get(getBootCamp)
	.put(updateBootCamp)
	.delete(deleteBootCamp);

module.exports = router;

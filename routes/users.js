// Used for authentication only
const express = require("express");
const { deleteCourse } = require("../controllers/Courses");
const {
   getUser,
   getUsers,
   createUser,
   deleteUser,
   updateUser
} = require("../controllers/users");
const { protect, authorize } = require('../middleware/auth')
const advancedResults = require('../middleware/advancedResults');
const User = require('../models/User');
const router = express.Router();

router.use(protect);
router.use(authorize('admin')); 
// all the routes below wil use the middleware on top
router.route("/").get(advancedResults(User), getUsers).post(createUser); // because they go to the same route
router.route("/:id").delete(deleteUser).put(updateUser).get(getUser);


module.exports = router

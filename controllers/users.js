const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");


// @description  GET all Users
// @route        GET /api/v1/auth/users
// @access       PRIVATE/Admin

exports.getUsers = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});



// @description  GET single Users
// @route        GET /api/v1/auth/users/:id
// @access       PRIVATE/Admin

exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    

    res.status(200).json({
        success: true,
        data: user,
    })
});


// @description  Greate Users
// @route        Post /api/v1/auth/users/
// @access       PRIVATE/Admin

exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);
    

    res.status(201).json({
        success: true,
        data: user,
    })
})


// @description  Update Users
// @route        Put /api/v1/auth/users/:id
// @access       PRIVATE/Admin

exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    

    res.status(200).json({
        success: true,
        data: user,
    })
})


// @description  Delere Users
// @route        DELETE /api/v1/auth/users/:id
// @access       PRIVATE/Admin

exports.deleteUser = asyncHandler(async (req, res, next) => {
     await User.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
        success: true,
        data: {},
    })
})




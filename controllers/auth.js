// Used for authentication only
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// @description  Register User
// @route        POST /api/v1/auth/register
// @access       PUBLIC

exports.register = asyncHandler(async (req, res, next) => {
    const {name, email, password, role } = req.body;
    
    // create user
    const user = await User.create({
        name,
        email,
        password,
        role
    });
    // craete JWT token for the user
    const token = user.getSignedJwtToken()
    res.status(200).json({ success: true, token});

})

// @description  Login User
// @route        PSOT /api/v1/auth/login
// @access       PUBLIC

exports.login = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;

    // validate email and password

    if(!email || !password){
        return next(
			new ErrorResponse(`Email or password is required`, 400)
		);
    }

    // check for user
    const user = await User.findOne({email}).select('+password');

    if(!user){
        return next(
			new ErrorResponse(`Invalid credentials`, 401)
		); 
    }

    // check if passwords matches
    const isMatch = await user.matchPassword(password);

    if(!isMatch){
        return next(
			new ErrorResponse(`Invalid credentials`, 401)
		);  
    }


    // craete JWT token for the user
    const token = user.getSignedJwtToken()
    res.status(200).json({ success: true, token});

})

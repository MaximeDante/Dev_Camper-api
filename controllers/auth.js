// Used for authentication only
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// @description  Register User
// @route        POST /api/v1/auth/register
// @access       PUBLIC

exports.register = asyncHandler(async (req, res, next) => {
	const { name, email, password, role } = req.body;

	// create user
	const user = await User.create({
		name,
		email,
		password,
		role,
	});
	// // craete JWT token for the user
	// const token = user.getSignedJwtToken();
	// res.status(200).json({ success: true, token });

	// send back data to client
	sendTokenResponse(user, 200, res);
});

// @description  Login User
// @route        POsT /api/v1/auth/login
// @access       PUBLIC

exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	// console.log(mongoose.connection.readyState);

	// validate email and password

	if (!email || !password) {
		return next(new ErrorResponse(`Email or password is required`, 400));
	}

	// check for user
	const user = await User.findOne({ email }).select("+password");

	if (!user) {
		return next(new ErrorResponse(`Invalid credentials`, 401));
	}

	// check if passwords matches
	const isMatch = await user.matchPassword(password);

	if (!isMatch) {
		return next(new ErrorResponse(`Invalid credentials`, 401));
	}

	// craete JWT token for the user
	// const token = user.getSignedJwtToken();
	// res.status(200).json({ success: true, token });

	// send back data to client
	sendTokenResponse(user, 200, res);
});

// get token from model, create cookie and send response

const sendTokenResponse = (user, statusCode, res) => {
	// create token
	const token = user.getSignedJwtToken();
	const options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === "production") {
		options.secure = true;
	}

	res
		.status(statusCode)
		.cookie("token", token, options)
		.json({ success: true, token });
};


// @description  GET current logged in user
// @route        POsT /api/v1/auth/lme
// @access       Private
exports.getMe = asyncHandler(async (req, res, next) => {
    console.log(req.user)
    const user = await User.findById(req.user.id);
    
    res
		.status(200)
		.json({ success: true, data: user });
}); 
// Used for authentication only
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");
const crypto = require('crypto');

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

// @description  GET current logged in user
// @route        POsT /api/v1/auth/me
// @access       Private
exports.getMe = asyncHandler(async (req, res, next) => {
	console.log(req.user);
	const user = await User.findById(req.user.id);

	res.status(200).json({ success: true, data: user });
});

// @description  Update user details
// @route        PUT /api/v1/auth/updatedetails
// @access       Private
exports.getMe = asyncHandler(async (req, res, next) => {
	const fieldsToUpdate ={
		name: req.body.name,
		email: req.body.email
	}
	const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
		new: true,
		runValidators: true
	} );

	res.status(200).json({ success: true, data: user });
});

// @description  Forgot password
// @route        POsT /api/v1/auth/forgotpassword
// @access       Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return next(new ErrorResponse(`There is no user with that email`, 404));
	}

	// get reset token

	const resetToken = user.getResetPasswordToken();
	await user.save({ validateBeforeSave: false });

	// create reset url
	const resetUrl = `${req.protocol}://${req.get(
		"host"
	)}/api/v1/auth/resetpassword/${resetToken}`;

	const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

	try {
		await sendEmail({
			email: user.email,
			subject: "Password reset token",
			message,
		});

		res.status(200).json({
			success: true,
			data: "email sent",
		});
	} catch (error) {
		console.log(error);
		user.resetPasswordToken = undefined;
		user.resetPsswordExpire = undefined;

		await user.save({ validateBeforeSave: false });

		return next(new ErrorResponse(`Email could ot be sent`, 500));
	}

	res.status(200).json({ success: true, data: user });
});

// @description  Reset pasword
// @route        PUT /api/v1/auth/resetpassword/:resettoken
// @access       public
exports.resetPassword = asyncHandler(async (req, res, next) => {
	// Get hashed token
	const resetPasswordToken = crypto
		.createHash("sha256")
		.update(req.params.resettoken)
		.digest("hex");

	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	});

	if (!user) {
		return next(new ErrorResponse("Invalid token", 400));
	}

	// Set new password
	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;
	await user.save();

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

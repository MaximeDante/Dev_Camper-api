const BootCamp = require("../models/Bootcamp");
// @description  GET all bootcamps
// @route        GET /api/v1/bootcamps
// @access       PUBLIC
exports.getBootCamps = async (req, res, next) => {
	try {
		const bootcamps = await BootCamp.find();

		res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
	} catch (err) {
		res.status(400).json({ success: false });
	}
};

// @description  GET single bootcamp
// @route        GET /api/v1/bootcamps/:id
// @access       PUBLIC
exports.getBootCamp = async (req, res, next) => {
	try {
		const bootcamp = await BootCamp.findById(req.params.id);

		if (!bootcamp) {
			return res.status(400).json({ success: false });
		}
		res.status(200).json({ success: true, data: bootcamp });
	} catch (err) {
		res.status(400).json({ success: false });
	}
};

// @description  CREATE new bootcamp
// @route        POST /api/v1/bootcamps/
// @access       Private
exports.createBootCamp = async (req, res, next) => {
	try {
		const bootcamp = await BootCamp.create(req.body);

		res.status(201).json({
			success: true,
			data: bootcamp,
		});
	} catch (err) {
		res.status(400).json({ success: false });
	}
};

// @description  UPDATE a bootcamp
// @route        PUT /api/v1/bootcamps/:id
// @access       Private
exports.updateBootCamp = async (req, res, next) => {
	try {
		const bootcamp = await BootCamp.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!bootcamp) {
			return res.status(400).json({ success: false });
		}
		res.status(200).json({
			success: true,
			data: bootcamp,
		});
	} catch (err) {
		res.status(400).json({ success: false });
	}
};

// @description  DELETE a bootcamp
// @route        DELEET /api/v1/bootcamps/:id
// @access       Private
exports.deleteBootCamp = async (req, res, next) => {
	try {
		const bootcamp = await BootCamp.findByIdAndDelete(req.params.id);

		if (!bootcamp) {
			return res.status(400).json({ success: false });
		}
		res.status(200).json({
			success: true,
			data: bootcamp,
		});
	} catch (err) {
		res.status(400).json({ success: false });
    }
     
};

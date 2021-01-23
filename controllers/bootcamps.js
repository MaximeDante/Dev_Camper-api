// @description  GET all bootcamps
// @route        GET /api/v1/bootcamps
// @access       PUBLIC
exports.getBootCamps = (req, res, next) => {
	res.status(200).json({ success: true, msg: `Get all bootcamps` });
};


// @description  GET single bootcamp
// @route        GET /api/v1/bootcamps/:id
// @access       PUBLIC
exports.getBootCamp  = (req, res, next) => {
    res
    .status(200)
    .json({ success: true, msg: `Show bootcamp ${req.params.id}` });
};

// @description  CREATE new bootcamp
// @route        POST /api/v1/bootcamps/
// @access       Private
exports.createBootCamp  = (req, res, next) => {
    res.status(200).json({ success: true, msg: `Create a new bootcamp` });
}; 

// @description  UPDATE a bootcamp
// @route        PUT /api/v1/bootcamps/:id
// @access       Private
exports.updateBootCamp  = (req, res, next) => {
    res
    .status(200)
    .json({ success: true, msg: `Update bootcamp ${req.params.id}` });
}; 

// @description  DELETE a bootcamp
// @route        DELEET /api/v1/bootcamps/:id
// @access       Private
exports.deleteBootCamp  = (req, res, next) => {
    res
    .status(200)
    .json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
}; 




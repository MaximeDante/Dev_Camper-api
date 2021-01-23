const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
	res.status(200).json({ success: true, msg: `Get all bootcamps` });
});

router.get("/:id", (req, res, next) => {
	res
		.status(200)
		.json({ success: true, msg: `Show bootcamp ${req.params.id}` });
});

router.post("/", (req, res, next) => {
	res.status(200).json({ success: true, msg: `Create a new bootcamp` });
});

router.put("/:id", (req, res, next) => {
	res
		.status(200)
		.json({ success: true, msg: `Update bootcamp ${req.params.id}` });
});
router.delete("/:id", (req, res, next) => {
	res
		.status(200)
		.json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
});

module.exports = router;

import express from "express";
const router = express.Router();

router.get('', function (req, res) {
	res.status(200).send({
		success: "true",
		message: "welcome to saltybot database api",
		version: "1.0.0"
	});
});

export { router };

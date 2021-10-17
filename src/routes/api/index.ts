import express from "express";
import fighterRouter from "./fighter";
import fightsRouter from "./fights";
import loginRouter from "./login";
const router = express.Router();

router.get('/api', function (req, res) {
	res.status(200).send({
		success: "true",
		message: "welcome to saltybot database api",
		version: "1.0.0"
	});
});

router.use('/api', fighterRouter.router);
router.use('/api', fightsRouter.router);
router.use('/api', loginRouter.router);

export default { router };

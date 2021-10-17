import express from "express-promise-router";
import fightsController = require("../../controllers/api/fights");
import loginController = require("../../controllers/api/login");

const router = express();

router.post('/fights', loginController.verifyJWT,fightsController.insertFight);

export {router};

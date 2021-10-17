import express from "express-promise-router";
import fightsController from "../../controllers/api/fights";
import loginController from "../../controllers/api/login";

const router = express();

router.post('/fights', loginController.verifyJWT,fightsController.insertFight);

export default {router};

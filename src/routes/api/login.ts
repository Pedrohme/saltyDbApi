import express from "express-promise-router";
import loginController from "../../controllers/api/login";
const router = express();

router.post('/login', loginController.generateJWT);

export default {router};

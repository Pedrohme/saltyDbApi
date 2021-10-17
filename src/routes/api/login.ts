import express from "express-promise-router";
import loginController = require("../../controllers/api/login");
const router = express();

router.post('/login', loginController.generateJWT);

export {router};

import express from "express-promise-router";
import fighterController = require("../../controllers/api/fighter");
import loginController = require("../../controllers/api/login");

const router = express();

router.get('/fighter/:name', fighterController.getOneFighter);

router.post('/fighter', loginController.verifyJWT, fighterController.insertFighter);

router.put('/fighter', loginController.verifyJWT, fighterController.updateFighter);

export {router};

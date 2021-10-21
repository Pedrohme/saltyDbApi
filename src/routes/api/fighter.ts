import express from "express-promise-router";
import fighterController from "../../controllers/api/fighter";
import loginController from "../../controllers/api/login";

const router = express();

router.get('/fighter/', fighterController.getOneFighter);

router.get('/fighter/search/', fighterController.searchFighter);

router.post('/fighter', loginController.verifyJWT, fighterController.insertFighter);

router.put('/fighter', loginController.verifyJWT, fighterController.updateFighter);

export default {router};

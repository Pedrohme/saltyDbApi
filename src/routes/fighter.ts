import express from "express-promise-router";
import fighterController from "../controllers/fighter";

const router = express();

router.get('/fighter/:name', fighterController.getOneFighter);

router.get('/fighter/', fighterController.getFighters);

export default {router};

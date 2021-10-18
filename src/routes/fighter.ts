import express from "express-promise-router";
import fighterController from "../controllers/fighter";

const router = express();

router.get('/fighter/:name', fighterController.getOneFighter);

router.get('/fighter/', fighterController.getFighters);

router.get('/fighter/:name/search', fighterController.searchFighter);

export default {router};

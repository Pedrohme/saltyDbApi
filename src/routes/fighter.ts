import express from "express-promise-router";
import fighterController from "../controllers/fighter";

const router = express();

router.get('/fighter/', fighterController.getOneFighter);

router.get('/fighter/search', fighterController.searchFighter);

export default {router};

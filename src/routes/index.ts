import express from "express";
import api from "./api";
import fighter from "./fighter";
const router = express.Router();

router.use('/', api.router);
router.use('/', fighter.router);

export default { router };

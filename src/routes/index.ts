import express from "express";
import path from "path";
import api from "./api";
import fighter from "./fighter";
import indexController from "../controllers/indexController";
const router = express.Router();

router.use('/', api.router);
router.use('/', fighter.router);

router.use('/scripts', express.static(path.join(__dirname, "../views/js")));
router.use('/styles', express.static(path.join(__dirname, "../views/css")));

router.get('/', indexController.renderIndexPage);
router.post('/', indexController.updateFighters);


export default { router };

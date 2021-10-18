import fighterModel from "../models/fighter";
import { Request, Response } from "express";

async function getFighters(req:Request, res:Response) {
    const { page, limit } = req.query;
    let pageNum = 1;
    let limitNum = 10;
    if (page) {
        pageNum = parseInt(page as string);
    }
    if (limit) {
        limitNum = parseInt(limit as string);
    }
    const response = await fighterModel.getFighters(req.url, pageNum, limitNum);
    if (response) {
        res.render("fighters", {fighters: response.rows, page:pageNum, limit:limitNum, url:req.baseUrl});
    }
    else {
        console.log("get Fighters query error");
        res.status(400).send({ message: "Get fighters query error"});
    }
}

async function getOneFighter(req:Request, res:Response) {
    const { name } = req.params;
    const response = await fighterModel.getOneFighter(req.url, name);
    if (response && response.rowCount > 0) {
        res.render("fighter", {fighter: response.rows[0], url:req.baseUrl});
    }
    else if (response) {
        res.render("fighter", {fighter: null, url:req.baseUrl});
    }
    else {
        res.render("error");
        res.status(400).send({ message: `Get one fighter (${name}) Query error` });
    }
}

export default {getFighters, getOneFighter};
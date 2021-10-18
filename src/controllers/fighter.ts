import fighterModel from "../models/fighter";
import fightsModel from "../models/fights";
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
        res.render("error");
        res.status(400).send({ message: "Get fighters query error"});
    }
}

async function getOneFighter(req:Request, res:Response) {
    const { name } = req.params;
    const responseFighter = await fighterModel.getOneFighter(req.url, name);
    const responseFights = await fightsModel.getFightsOne(req.url, name);
    if (responseFighter && responseFighter.rowCount > 0) {
        res.render("fighter", {fighter: responseFighter.rows[0], fights:responseFights?.rows, url:req.baseUrl});
    }
    else if (responseFighter) {
        res.render("fighter", {fighter: null, url:req.baseUrl});
    }
    else {
        res.render("error");
        res.status(400).send({ message: `Get one fighter (${name}) Query error` });
    }
}

async function searchFighter(req:Request, res:Response) {
    const { page, limit } = req.query;
    const { name } = req.params;
    let pageNum = 1;
    let limitNum = 10;
    if (page) {
        pageNum = parseInt(page as string);
    }
    if (limit) {
        limitNum = parseInt(limit as string);
    }
    const response = await fighterModel.searchFighter(req.url, name, pageNum, limitNum);
    if (response) {
        res.render("fighters", {fighters: response.rows, page:pageNum, limit:limitNum, url:req.baseUrl, search:true, name:name});
    }
    else {
        res.render("error");
        res.status(400).send({ message: "Get fighters query error"});
    }
}

export default {getFighters, getOneFighter, searchFighter};
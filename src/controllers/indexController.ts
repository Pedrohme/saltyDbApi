import { Request, Response } from "express";
import indexModel from "../models/indexModel";
import {Fighter} from "../models/fighter";
import {FightElement} from "../models/fights";

let currentFight: {
    fightera:Fighter,
    fighterb:Fighter,
    pastFights:FightElement[]|undefined,
}

async function updateFighters(req:Request, res:Response) {
    const { fightera, fighterb, tier } = req.body;
    const response = await indexModel.updateFighters(req.url, fightera, fighterb, tier);
    if (response) {
        currentFight = response;
        res.status(200).send({ message: "index page updated"});
    }
    else {
        res.status(400).send({ message: "Update fighters query error"});
    }
}

async function renderIndexPage(req:Request, res:Response) {
    if (currentFight) {
        res.render("index", {fightera: currentFight.fightera, fighterb: currentFight.fighterb, pastFights: currentFight.pastFights, nodata:false, url:req.baseUrl});
    }
    else {
        res.render("index", {nodata: true});
    }
}

export default {updateFighters, renderIndexPage};


import { Request, Response } from "express";
import indexModel from "../models/indexModel";

let fighteraGlobal:any;
let fighterbGlobal:any;
let pastfights:any;

async function updateFighters(req:Request, res:Response) {
    const { fightera, fighterb } = req.body;
    const response = await indexModel.updateFighters(req.url, fightera, fighterb);
    if (response) {
        fighteraGlobal = response[0];
        fighterbGlobal = response[1];
        pastfights = response[2];
        res.status(200).send({ message: "index page updated"});
    }
    else {
        res.status(400).send({ message: "Update fighters query error"});
    }
}

async function renderIndexPage(req:Request, res:Response) {
    if (fighteraGlobal && fighterbGlobal) {
        res.render("index", {fightera: fighteraGlobal, fighterb: fighterbGlobal, pastFights: pastfights, nodata:false, url:req.baseUrl});
    }
    else {
        res.render("index", {nodata: true});
    }
}

export default {updateFighters, renderIndexPage};


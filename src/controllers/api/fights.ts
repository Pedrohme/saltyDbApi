import fightsModel from "../../models/fights";
import { Request, Response } from "express";

async function insertFight(req:Request, res:Response) {
    const { fightera, fighterb, winner } = req.body;
    const response = await fightsModel.insertFight(fightera, fighterb, winner);

    if (response) {
        console.log("Fight added successfully", response.rows);
        res.status(201).send({ message: "Fight added successfully" });
    }
    else {
        console.log("Add fight query error");
        res.status(400).send({message: "Query error"});
    }
}

async function getFightsBoth(req:Request, res:Response) {
    const {fightera, fighterb} = req.query;
    const response = await fightsModel.getFightsBoth(req.url, fightera as string, fighterb as string);
    if (response) {
        console.log("Got fights");
        res.status(200).send({data: response.rows});
    }
    else {
        console.log("get Fighters (both) query error");
        res.status(400).send({ message: "Get fighters (both) query error"});
    }
}

async function getFightsOne(req:Request, res:Response) {
    const { fighter } = req.params;
    const response = await fightsModel.getFightsOne(req.url, fighter);
    if (response) {
        console.log("Got fights");
        res.status(200).send({data: response.rows});
    }
    else {
        console.log("get Fighters query error");
        res.status(400).send({ message: "Get fighters query error"});
    }
}

async function getFights(req:Request, res:Response) {
    const { page, limit } = req.query;
    let pageNum = 1;
    let limitNum = 10;
    if (page) {
        pageNum = parseInt(page as string);
    }
    if (limit) {
        limitNum = parseInt(limit as string);
    }
    const response = await fightsModel.getFights(req.url, pageNum, limitNum);
    if (response) {
        console.log("Fights page successful");
        res.status(200).send({data: response.rows});
    }
    else {
        console.log("get Fights query error");
        res.status(400).send({ message: "Get fighters query error"});
    }
}


export default {insertFight, getFightsBoth, getFightsOne, getFights};
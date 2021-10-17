import fightsModel = require("../../models/fights");
import { Request, Response } from "express";

export async function insertFight(req:Request, res:Response) {
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
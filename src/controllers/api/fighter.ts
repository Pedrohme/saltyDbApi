import fighterModel from "../../models/fighter";
import { Request, Response } from "express";

async function insertFighter(req:Request, res:Response) {
    const { name } = req.body;
    const response = await fighterModel.insertFighter(name);

    if (response) {
        console.log(`${name} added successfully`);
        res.status(201).send({
            message: `${name} added successfully`,
            data: { fighter: [ name, 0, 0 ] }
        });
    }
    else {
        console.log(`insert fighter (${name}) Query error`);
        res.status(400).send({message: `insert fighter (${name}) Query error`});
    }
}

async function getFighters(req:Request, res:Response) {
    const { page } = req.query;
    let pageNum = 1;
    if (page) {
        pageNum = parseInt(page as string);
    }
    const response = await fighterModel.getFighters(req.url, pageNum);
    if (response) {
        console.log("Fighter page successful");
        res.status(200).send({data: response.rows});
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
        console.log("Query successful", response.rows);
        res.status(200).send({
            message: `${name} found`,
            data: response.rows[0]
        });
    }
    else if (response) {
        console.log(`${name} not found`);
        res.status(204).send();
    }
    else {
        console.log(`Get one fighter (${name}) Query error`);
        res.status(400).send({ message: `Get one fighter (${name}) Query error` });
    }
}

async function updateFighter(req:Request, res:Response) {
    const {wins, losses, name} = req.body;

    const response = await fighterModel.updateFighter(wins, losses, name);
    if (response) {
        console.log(`${name} updated successfuly`);
        res.status(200).send({ message: `${name} updated successfuly`});
    }
    else {
        console.log(`Update Fighter (${name}) Query error`);
        res.status(400).send({ message: `Update Fighter (${name}) Query error`});
    }
}

export default {insertFighter, getFighters, getOneFighter, updateFighter};
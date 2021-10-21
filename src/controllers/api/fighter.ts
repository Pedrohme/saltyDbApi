import fighterModel from "../../models/fighter";
import { Request, Response } from "express";
import { client, q } from "../../db/db";

async function insertFighter(req:Request, res:Response) {
    const { name, tier } = req.body;
    const response = await fighterModel.insertFighter(name, tier);

    if (response) {
        console.log(`${name} added successfully`);
        res.status(201).send({
            message: `${name} added successfully`,
            data: response.data
        });
    }
    else {
        console.log(`insert fighter (${name}) Query error`);
        res.status(400).send({message: `insert fighter (${name}) Query error`});
    }
}

async function getOneFighter(req:Request, res:Response) {
    const { name, tier } = req.query;
    if (typeof name === 'string' && typeof tier === 'string') {
        const response = await fighterModel.getOneFighter(req.url, name, tier);
        if (response) {
            console.log("Query successful", response.data);
            res.status(200).send({
                message: `${name} found`,
                data: response.data
            });
        }
        else {
            console.log(`${name} not found`);
            res.status(204).send();
        }
    }
    else {
        console.log(`Invalid parameters`);
        res.status(400).send({ message: `Invalid parameters`});
    }
}

async function updateFighter(req:Request, res:Response) {
    const {wins, losses, name, tier} = req.body;

    const response = await fighterModel.updateFighter(wins, losses, name, tier);
    if (response) {
        console.log(`${name} updated successfuly`);
        res.status(200).send({ message: `${name} updated successfuly`});
    }
    else {
        console.log(`Update Fighter (${name}) error`);
        res.status(400).send({ message: `Update Fighter (${name}) error`});
    }
}

async function searchFighter(req:Request, res:Response) {
    const { page, name, previous } = req.query;

    if (typeof name === 'string') {
        let pag:string|undefined = undefined;
        let prev:boolean|undefined = undefined;
        if (previous) {
            if (previous === 'false') prev = false;
            if (previous === 'true') prev = true;
        }
        if (typeof page === 'string') {
            pag = await client.query(
                q.Ref(q.Collection('fighter'), page)
            );
        }
        const response = await fighterModel.searchFighter(req.url, name, undefined, pag, prev);
        if (response) {
            console.log("Query successful", response);
            res.status(200).send(response);
        }
        else {
            console.log(`${name} not found`);
            res.status(204).send();
        }
    }
    else {
        console.log(`Invalid parameters error`);
        res.status(400).send({ message: `Invalid parameters` });
    }
}

export default {insertFighter, getOneFighter, updateFighter, searchFighter};
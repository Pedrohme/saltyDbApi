import fightsModel from "../../models/fights";
import { Request, Response } from "express";

async function insertFight(req:Request, res:Response) {
    const { tier, fightera, fighterb, winner } = req.body;
    const response = await fightsModel.insertFight(tier, fightera, fighterb, winner);

    if (response) {
        console.log("Fight added successfully", response.data);
        res.status(201).send({ message: "Fight added successfully", data: response.data });
    }
    else {
        console.log("Add fight query error");
        res.status(400).send({message: "Query error"});
    }
}

async function getFightsBoth(req:Request, res:Response) {
    const {fightera, fighterb, tier, limit, page} = req.query;
    if (typeof fightera === 'string' &&  typeof fighterb === 'string' && typeof tier === 'string') {
        let lim:number|undefined = undefined;
        let pag:string|undefined = undefined;
        if (limit) lim = Number(limit);
        if (typeof page === 'string') pag = page;
        
        const response = await fightsModel.getFightsBoth(req.url, fightera, fighterb, tier, lim, pag);
        if (response) {
            console.log("Got fights");
            res.status(200).send(response);
        }
        else {
            console.log("get Fighters (both) query error");
            res.status(400).send({ message: "Get fighters (both) query error"});
        }
    }
    else {
        res.status(400).send({ message: "parameters error" });
    }
}

async function getFightsOne(req:Request, res:Response) {
    const { fighter, tier, limit, page } = req.query;
    if (typeof fighter === 'string' && typeof tier === 'string') { 
        let lim:number|undefined = undefined;
        let pag:string|undefined = undefined;
        if (limit) lim = Number(limit);
        if (typeof page === 'string') pag = page;
        
        const response = await fightsModel.getFightsOne(req.url, fighter, tier, lim, pag);
        if (response) {
            console.log("Got fights");
            res.status(200).send(response);
        }
        else {
            console.log("get Fighters query error");
            res.status(400).send({ message: "Get fighters query error"});
        }
    }
}

export default {insertFight, getFightsBoth, getFightsOne};
import fighterModel from "../models/fighter";
import fightsModel from "../models/fights";
import { Request, Response } from "express";


async function getOneFighter(req:Request, res:Response) {
    const { name, tier, limit, page } = req.query;
    if (typeof name === 'string' && typeof tier === 'string') {
        const responseFighter = await fighterModel.getOneFighter(req.url, name, tier);
        if (responseFighter) {
            let lim:number|undefined = undefined;
            let pag:string|undefined = undefined;
            if (limit) lim = Number(limit);
            if (typeof page === 'string') pag = page;
            const responseFights = await fightsModel.getFightsOne(req.url, name, tier, lim, pag);
            res.render("fighter", {fighter: responseFighter.data, fights:responseFights?.data, url:req.baseUrl, before:responseFights?.before, after:responseFights?.after});
        }
        else {
            res.render("fighter", {fighter: null, url:req.baseUrl});
        }
    }
    else {
        res.render("error");
        res.status(400).send({ message: `Get one fighter (${name}) Query error` });
    }
}

async function searchFighter(req:Request, res:Response) {
    const { page, limit, name } = req.query;

    if(typeof name === 'string') {
        let lim:number|undefined = undefined;
        let pag:string|undefined = undefined;
        if (limit) lim = Number(limit);
        if (typeof page === 'string') pag = page;

        const response = await fighterModel.searchFighter(req.url, name, lim, pag);
        if (response) {
            res.render("fighters", {fighters: response.data, url:req.baseUrl, before:response.before, after:response.after, name: name, page: pag});
        }
        else {
            res.render("error");
            res.status(400).send({ message: "Get fighters query error"});
        }
    }
}

export default {getOneFighter, searchFighter};
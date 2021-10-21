import fighterModel from "../models/fighter";
import fightsModel from "../models/fights";
import { Request, Response } from "express";
import { client, q } from "../db/db";

async function getOneFighter(req:Request, res:Response) {
    const { name, tier, page, previous } = req.query;
    if (typeof name === 'string' && typeof tier === 'string') {
        const responseFighter = await fighterModel.getOneFighter(req.url, name, tier);
        if (responseFighter) {
            let pag:string|undefined = undefined;
            if (typeof page === 'string') pag = page;
            let prev:boolean|undefined = undefined;
            if (previous) {
                if (previous === 'false') prev = false;
                if (previous === 'true') prev = true;
            }
            const responseFights = await fightsModel.getFightsOne(req.url, name, tier, undefined, pag, prev);
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
    const { page, name, previous } = req.query;

    if(typeof name === 'string') {
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
        let before:any;
        let after:any;
        if (response?.before) {
            before = response.before;
        }
        else {
            before = null;
        }
        if (response?.after) {
            after = response.after;
        }
        else {
            after = null;
        }
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
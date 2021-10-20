import {client, q} from "../db/db";
import nCache from "node-cache";

const tiers = ["P", "B", "A", "S", "X"];
const limitValues = [10, 50, 100];

export interface Fighter {
    name:string;
    tier:string;
    wins:number;
    losses:number;
}

export interface FighterElement {
    ref:string;
    ts:number;
    data:Fighter; 
}

export interface SearchByNameResult {
    before:any;
    after:any;
    data: Array<FighterElement>;
}


const cache = new nCache({ stdTTL: 10, checkperiod: 2, useClones: false });

async function insertFighter(name:string, tier:string) {
    if (name.length <= 64 && tiers.includes(tier)) {
        try {
            const result = await client.query(
                q.Create(
                    q.Collection("fighter"),
                    {
                        data: {
                            name: name,
                            tier: tier,
                            wins: 0,
                            losses: 0
                        }
                    }
                )
            );
            const res = result as FighterElement;
            return res;
        } 
        catch (error) {
            if (error instanceof Error) {
                console.log(error);
            }
        }
    }
    return null;
}

async function getOneFighter(url:string, name:string, tier:string) {
    if (name.length <= 64 && tiers.includes(tier)) {
        const cacheKey = "__cache__" + url;
        const value = await cache.get(cacheKey);
        if (value) {
            console.log("hit cache");
            return value as FighterElement;
        }
        try {
            const result = await client.query(
                q.Get(
                    q.Match(
                        q.Index("get_fighter"),
                        name,
                        tier
                    )
                )
            );
            const res = result as FighterElement;
            cache.set(cacheKey, res);
            return res;
        } catch (error) {
            if (error instanceof Error) {
                console.log(error);
            }
        }
    }
    return null;
}

async function updateFighter(wins:number, losses:number, name:string, tier:string) {
    if (name.length <= 64 && tiers.includes(tier) && ((wins === 1 && losses === 0) || (wins === 0 && losses === 1))) {
        try {
            const getResult = await client.query(
                q.Get(
                    q.Match(
                        q.Index("get_fighter"),
                        name,
                        tier
                    )
                )
            );
            const getRes = getResult as FighterElement;
            const result = await client.query(
                q.Update(
                    getRes.ref,
                    {
                        data: {
                            wins: getRes.data.wins+wins,
                            losses: getRes.data.losses+losses
                        }
                    }
                )  
            );
            const res = result as FighterElement;
            return res;
        } 
        catch (error) {
            if (error instanceof Error) {
                console.log(error);
            }
        }
    }
    return null;
}

async function searchFighter(url:string, name:string, limit = 10, page?:string) {
    if (name.length <= 64 && limitValues.includes(limit)) {
        const cacheKey = "__cache__" + url;
        const value = await cache.get(cacheKey);
        if (value) {
            console.log("hit cache");
            return value as SearchByNameResult;
        }

        const pageOptions: {[k:string]: any} = {};
        if (limit) {
            pageOptions.size = limit;
        }
        if(page) {
            pageOptions.after = page;
        }

        try {
            const result = await client.query(
                q.Map(
                    q.Filter(
                        q.Paginate(
                            q.Match(
                                q.Index("all_fighters")
                            ),
                            pageOptions
                        ),
                        q.Lambda(
                            "fighterRef",
                            q.ContainsStr(
                                q.LowerCase(
                                    q.Select(
                                        ["data", "name"],
                                        q.Get(
                                            q.Var("fighterRef")
                                        )
                                    )
                                ), 
                                name
                            )
                        )
                    ),
                    q.Lambda(
                        "fighterRef",
                        q.Get(
                            q.Var("fighterRef")
                        )
                    )
                )
            );
            const res = result as SearchByNameResult;
            cache.set(cacheKey, res);
            return res;
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(error);
            }
        }
    }
    return null;
}

export default {insertFighter, getOneFighter, updateFighter, searchFighter};
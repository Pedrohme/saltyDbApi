import {client, q} from "../db/db";
import nCache from "node-cache";

const tiers = ["P", "B", "A", "S", "X"];
const limitValues = [10, 50, 100];

export interface Fight {
    tier:string;
    fightera:string;
    fighterb:string;
    winner:string;
}

export interface FightElement {
    ref:string;
    ts:number;
    data:Fight; 
}

export interface getFightsResult {
    before:any;
    after:any;
    data: Array<FightElement>;
}

const cache = new nCache({ stdTTL: 10, checkperiod: 2, useClones: false });

async function insertFight(tier:string, fightera:string, fighterb:string, winner:string) {
    if (fightera.length <= 64 && fighterb.length <= 64 && tiers.includes(tier)) {
        const date = new Date().toISOString().replace('-', '/').split('T')[0].replace('-', '/');
        try {
            const result = await client.query(
                q.Create(
                    q.Collection("fights"),
                    {
                        data: {
                            tier: tier,
                            fightera: fightera,
                            fighterb: fighterb,
                            winner: winner,
                            timestamp: date
                        }
                    }
                )
            );
            const res = result as FightElement;
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

async function getFightsBoth(url:string, fightera:string, fighterb:string, tier:string, limit = 10, page?:string) {
    if (fightera.length <= 64 && fighterb.length <= 64 && tiers.includes(tier) && limitValues.includes(limit)) {
        const cacheKey = "__cache__" + url;
        const value = await cache.get(cacheKey);
    
        if (value) {
            console.log("hit cache");
            return value as getFightsResult;
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
                    q.Paginate(
                        q.Union(
                            q.Match(q.Index("get_fight_fa_fb"), fightera, fighterb, tier),
                            q.Match(q.Index("get_fight_fa_fb"), fighterb, fightera, tier)
                        ),
                        pageOptions
                    ),
                    q.Lambda(
                        "fightRef",
                        q.Get(
                            q.Var("fightRef")
                        )
                    )
                )
            )
            const res = result as getFightsResult;
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

async function getFightsOne(url:string, fighter:string, tier:string, limit = 10, page?:string) {
    if (fighter.length <= 64 && tiers.includes(tier) && limitValues.includes(limit)) {
        const cacheKey = "__cache__" + url;
        const value = await cache.get(cacheKey);
    
        if (value) {
            console.log("hit cache");
            return value as getFightsResult;
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
                    q.Paginate(
                        q.Union(
                            q.Match(q.Index("get_fight_fightera"), fighter, tier),
                            q.Match(q.Index("get_fight_fighterb"), fighter, tier),
                        ),
                        pageOptions
                    ),
                    q.Lambda(
                        "fightRef",
                        q.Get(
                            q.Var("fightRef")
                        )
                    )
                )
            )
            const res = result as getFightsResult;
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


export default {insertFight, getFightsBoth, getFightsOne};
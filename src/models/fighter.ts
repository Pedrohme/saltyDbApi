import db = require("../db/db");
import nCache from "node-cache";
import { QueryResult } from "pg";

const cache = new nCache({ stdTTL: 10, checkperiod: 2, useClones: false });

const selectFighterQuery = "SELECT * FROM fighter WHERE name = $1";
const insertFighterQuery = "INSERT INTO fighter(name, wins, losses) VALUES($1, $2, $3)";
const updateFighterQuery = "UPDATE fighter SET wins = wins+$1, losses = losses+$2 WHERE name = $3";

export async function insertFighter(name:string) {
    const response = await db.query(insertFighterQuery, [name, 0, 0]);
    if (response) {
        return response;
    }
    else {
        return null;
    }
}

export async function getOneFighter(url:string, name:string) {
    const cacheKey = "__cache__" + url;
    const value = await cache.get(cacheKey);
    if (value) {
        console.log("hit cache");
        return value as QueryResult;
    }
    const response = await db.query(selectFighterQuery, [name]);
    cache.set(cacheKey, response); 
    return response;
}

export async function updateFighter(wins:number, losses:number, name:string) {
    const response = await db.query(updateFighterQuery, [wins, losses, name]);
    if (response) {
        return response;
    }
    else {
        return null;
    }
}
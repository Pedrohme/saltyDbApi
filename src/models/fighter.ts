import db from "../db/db";
import nCache from "node-cache";
import { QueryResult } from "pg";

const cache = new nCache({ stdTTL: 10, checkperiod: 2, useClones: false });

const selectOneFighterQuery = "SELECT * FROM fighter WHERE name = $1";
const selectFightersQuery = "SELECT * FROM fighter OFFSET $1 LIMIT $2";
const insertFighterQuery = "INSERT INTO fighter(name, wins, losses) VALUES($1, $2, $3)";
const updateFighterQuery = "UPDATE fighter SET wins = wins+$1, losses = losses+$2 WHERE name = $3";
const searchFighterQuery = "SELECT * FROM fighter WHERE name ILIKE ('%' || $1 || '%') OFFSET $2 LIMIT $3";

async function insertFighter(name:string) {
    const response = await db.query(insertFighterQuery, [name, 0, 0]);
    if (response) {
        return response;
    }
    else {
        return null;
    }
}

async function getFighters(url:string, page = 1, limit = 10) {
    page = (page-1) * limit;

    const cacheKey = "__cache__" + url;
    const value = await cache.get(cacheKey);
    if (value) {
        console.log("hit cache");
        return value as QueryResult;
    }
    const response = await db.query(selectFightersQuery, [page, limit]);
    cache.set(cacheKey, response); 
    return response;
}

async function getOneFighter(url:string, name:string) {
    const cacheKey = "__cache__" + url;
    const value = await cache.get(cacheKey);
    if (value) {
        console.log("hit cache");
        return value as QueryResult;
    }
    const response = await db.query(selectOneFighterQuery, [name]);
    cache.set(cacheKey, response); 
    return response;
}

async function updateFighter(wins:number, losses:number, name:string) {
    const response = await db.query(updateFighterQuery, [wins, losses, name]);
    if (response) {
        return response;
    }
    else {
        return null;
    }
}

async function searchFighter(url:string, name:string, page = 1, limit = 10) {
    page = (page-1) * limit;

    const cacheKey = "__cache__" + url;
    const value = await cache.get(cacheKey);
    if (value) {
        console.log("hit cache");
        return value as QueryResult;
    }
    const response = await db.query(searchFighterQuery, [name, page, limit]);
    cache.set(cacheKey, response); 
    return response;
}

export default {insertFighter, getFighters, getOneFighter, updateFighter, searchFighter};
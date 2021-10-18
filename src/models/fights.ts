import db from "../db/db";
import nCache from "node-cache";
import { QueryResult } from "pg";

const cache = new nCache({ stdTTL: 10, checkperiod: 2, useClones: false });

const insertFightQuery = "INSERT INTO fights(fightera, fighterb, winner) VALUES($1, $2, $3)";
const selectFightsBothQuery = "SELECT * FROM fights WHERE fightera = $1 AND fighterb = $2";
const selectFightsOneQuery = "SELECT * FROM fights WHERE fightera = $1 OR fighterb = $1";
const selectFightsQuery = "SELECT * FROM fights ORDER BY id DESC OFFSET $1 LIMIT $2;";

async function insertFight(fightera:string, fighterb:string, winner:string) {
    const response = await db.query(insertFightQuery, [fightera, fighterb, winner]);

    if (response) {
        return response;
    }
    else {
        return null;
    }
}

async function getFightsBoth(url:string, fightera:string, fighterb:string) {
    const cacheKey = "__cache__" + url;
    const value = await cache.get(cacheKey);

    if (value) {
        console.log("hit cache");
        return value as QueryResult;
    }

    const response = await db.query(selectFightsBothQuery, [fightera, fighterb]);
    if (response) {
        return response;
    }
    else {
        return null;
    }
}

async function getFightsOne(url:string, fighter:string) {
    const cacheKey = "__cache__" + url;
    const value = await cache.get(cacheKey);

    if (value) {
        console.log("hit cache");
        return value as QueryResult;
    }

    const response = await db.query(selectFightsOneQuery, [fighter]);
    if (response) {
        return response;
    }
    else {
        return null;
    }
}

async function getFights(url:string, page = 1, limit = 10) {
    page = (page-1) * limit;

    const cacheKey = "__cache__" + url;
    const value = await cache.get(cacheKey);
    if (value) {
        console.log("hit cache");
        return value as QueryResult;
    }
    const response = await db.query(selectFightsQuery, [page, limit]);
    cache.set(cacheKey, response); 
    return response;
}

export default {insertFight, getFightsBoth, getFightsOne, getFights};
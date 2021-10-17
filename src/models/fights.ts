import db = require("../db/db");

const insertFightQuery = "INSERT INTO fights(fightera, fighterb, winner) VALUES($1, $2, $3)";

export async function insertFight(fightera:string, fighterb:string, winner:string) {
    const response = await db.query(insertFightQuery, [fightera, fighterb, winner]);

    if (response) {
        return response;
    }
    else {
        return null;
    }
}
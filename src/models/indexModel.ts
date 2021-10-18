import db from "../db/db";
import fighterModel from "./fighter";
import fightsModel from "./fights";

async function updateFighters(url: string, fightera:string, fighterb:string) {
    const fighteraUrl = url + "api/fighter/" + fightera;
    const fighterbUrl = url + "api/fighter/" + fighterb;
    const responsea = await fighterModel.getOneFighter(fighteraUrl, fightera);
    const responseb = await fighterModel.getOneFighter(fighterbUrl, fighterb);

    if((responsea && responsea.rowCount > 0) && (responseb && responseb.rowCount > 0)) {
        const fightsUrl = url + `/api/fights/both/?fightera=${responsea.rows[0]["name"]}&fighterb=${responseb.rows[0]["name"]}`;
        const pastFights = await fightsModel.getFightsBoth(fightsUrl, responsea.rows[0]["name"], responseb.rows[0]["name"]);
        return [responsea.rows[0], responseb.rows[0], pastFights?.rows];
    }
    return null;
}

export default {updateFighters};
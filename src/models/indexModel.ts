import fighterModel from "./fighter";
import fightsModel from "./fights";

async function updateFighters(url: string, fightera:string, fighterb:string, tier:string) {
    const fighteraUrl = url + "api/fighter/" + fightera;
    const fighterbUrl = url + "api/fighter/" + fighterb;
    const responsea = await fighterModel.getOneFighter(fighteraUrl, fightera, tier);
    const responseb = await fighterModel.getOneFighter(fighterbUrl, fighterb, tier);

    if(responsea && responseb) {
        const fightsUrl = url + `/api/fights/both/?fightera=${responsea.data.name}&fighterb=${responseb.data.name}`;
        const pastFights = await fightsModel.getFightsBoth(fightsUrl, responsea.data.name, responseb.data.name, tier);
        return [responsea.data.name, responseb.data.name, pastFights?.data];
    }
    return null;
}

export default {updateFighters};
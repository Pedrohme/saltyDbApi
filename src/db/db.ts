import fauna from "faunadb";

export const client = new fauna.Client({
    secret: process.env.FAUNA_SECRET as string,
    domain: process.env.FAUNA_DOMAIN as string
})
export const q = fauna.query;

export default {client, q};
import {client, q} from "../../db/db";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import {Request, Response, NextFunction} from "express";

interface Admin {
    name:string;
    password:string;
}

interface AdminElement {
    ref:string;
    ts:number;
    data:Admin; 
}

async function generateJWT(req:Request, res:Response) {
    const {name, password} = req.body;
    
    let response:any;
    try {
        const result = await client.query(
            q.Get(
                q.Match(
                    q.Index("get_admin"),
                    name,
                )
            )
        );
        response = result as AdminElement;
    } catch (error) {
        if (error instanceof Error) {
            console.log(error);
        }
        res.status(500).send({message: 'database error'});
    }

    if (response) {
        const match = await bcrypt.compare(password, response.data.password);
        if (match) {
            const id = response.ref.id;
            jwt.sign({id}, (<Secret>process.env.JWT_SECRET), {expiresIn: "30d"}, function(err, token) {
                if (err) {
                    return res.status(500).send({ message: 'Failed to generate token'});
                }
                else {
                    return res.status(200).send({auth: true, token: token});
                }
            });
        }
        else {
            res.status(500).send({message: 'invalid login'});
        }
    }
    else {
        res.status(500).send({message: 'database error'});
    }
}

async function verifyJWT(req:Request, res:Response, next:NextFunction) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided'});

    jwt.verify(token as string, process.env.JWT_SECRET as Secret, function(err, decoded) {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token'});
        }
        if (decoded) {
            (req as any).userId = decoded.id;
            next();
        }
        else {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token'});   
        }
    });
}

export default {generateJWT, verifyJWT};
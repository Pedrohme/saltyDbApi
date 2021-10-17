import db = require("../../db/db");
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import {Request, Response, NextFunction} from "express";

const getAdminQuery = "SELECT * FROM admins WHERE name = $1";

export async function generateJWT(req:Request, res:Response) {
    const {user, password} = req.body;
        
    const response = await db.query(getAdminQuery, [user]);

    if (response && response.rowCount > 0) {
        const match = await bcrypt.compare(password, response?.rows[0]["password"]);
        if (match) {
            const id = response.rows[0]["id"];
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

export async function verifyJWT(req:Request, res:Response, next:NextFunction) {
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
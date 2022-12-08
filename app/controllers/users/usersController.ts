/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Request, Response  } from "express";
import { QueryResult } from 'pg';
import { pool } from "../../db_client";
import 'dotenv/config';

import * as bcrypt from 'bcrypt';
import * as nodemailer from "nodemailer";
import * as jwt from 'jsonwebtoken';


// -------------------    MOVE QUERIES INTO DATAMAPPER    ----------------------------

export const checkUsers = (req: Request, res: Response) => {
    const test = req.header('authorization');
    console.log(test)
    res.send("Users")
};

export const signUp = async (req: Request<never, never, { email: string; password: string }, never>, res: Response) => {
    try {

        const {email, password} = req.body;

        if(!email){
            res.status(404).json('Email cannot be empty')
        }

        if(!password){
            res.status(404).json('Password cannot be empty')
        }

        const passwordHash: any = await bcrypt.hash(password, 10);

        if(!passwordHash){
            res.status(404).json('Password cannot be hashed')
        }

        interface queryCheck {
            text?: string,
            values?: string[],
        }

        const queryCheck= {
            text: `SELECT * FROM "users" WHERE "email" ILIKE $1;`,
            values: [email]
        }

        const resultCheck: QueryResult = await pool.query(queryCheck);

        if(resultCheck.rows[0]) {
            res.status(404).json('Email already exist in DB')
        } else {
            interface queryAdd {
                text?: string,
                values?: string[],
            }
    
            const queryAdd = {
                text: `INSERT INTO "users" (email, password) VALUES ($1, $2) RETURNING *`,
                values: [email, passwordHash]
            };
        
            const resultAdd: QueryResult = await pool.query(queryAdd);

            // NODEMAILER
            const transport = nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                  user: process.env.USER_MAIL,
                  pass: process.env.PASSWORD_MAIL
                }
            });

            const token = jwt.sign(resultAdd.rows[0].id, process.env.SECRET_JWT)

            if(token) {
                const tokenWithoutDots = token.replace(/\./g,'-')
                await transport.sendMail({
                    from: 'Homemademeal <c72e713e5c-b76a9d+1@inbox.mailtrap.io>', // sender address
                    to: 'benake83@gmail.com', // list of receivers
                    subject: 'Activation de compte', // Subject line
                    text: 'Activation de compte', // plaintext body
                    // ENVOYER LE MAIL AU LIEN DE l'APP FRONT AVEC LE TOKEN BACK (USEEFFECT)
                    html: `<p> Cliquez sur le lien pour activer votre compte: <a href="http://localhost:5173/confirm/${tokenWithoutDots}"> Activation </a> </p>` // html body
                });
            }
    
            return res.status(200).json("Signup success");
        }

    } catch(err) {

        console.error(err)
        return res.status(500).json('Sign up failed');
        
    }
};

export const confirm = async (req: Request, res: Response) => {
    try {

        const tokenURL = req.params;

        const decoded = jwt.verify(tokenURL.id, process.env.SECRET_JWT);

        interface queryUpload {
            text?: string,
            values?: any[],
        }

        const queryUpload = {
            text: `UPDATE "users" SET "is_confirm" = $1, "updated_at" = CURRENT_TIMESTAMP WHERE "id" = $2 RETURNING *`,
            values: [true, Number(decoded)]
        }

        const resultCheck: QueryResult = await pool.query(queryUpload);

        if(resultCheck) {

            interface userInfos {
                id: number,
                email: string,
                firstName: string,
                secondName: string
            }

            const userInfos = {
                id: resultCheck.rows[0].id,
                email: resultCheck.rows[0].email,
                firstName: resultCheck.rows[0].firstName,
                secondName: resultCheck.rows[0].secondName,
                is_confirm: resultCheck.rows[0].is_confirm,
            }

            return res.status(200).json(userInfos);
        }
        

    }catch(err){
        
        console.error(err)
        return res.status(500).json('Confirm failed');
        
    }
}

export const login = async (req: Request<never, never, { email: string; password: string }, never>, res: Response) => {
    try {

        const {email, password} = req.body;
        console.log('email ' + email)
        console.log('password ' + password)

        if(!email){
            res.status(404).json('Email cannot be empty')
        }

        if(!password){
            console.log("error")
            res.status(404).json('Password cannot be empty')
        }

        interface queryCheck {
            text?: string,
            values?: string[],
        }

        const queryCheck= {
            text: `SELECT * FROM "users" WHERE "email" ILIKE $1;`,
            values: [email]
        }

        const resultCheck: QueryResult = await pool.query(queryCheck);

        console.log(resultCheck.rows)
        // console.log(resultCheck.rows[0].is_confirm)

        if(resultCheck && resultCheck.rows[0].is_confirm === true){
            const passwordCheck: any = await bcrypt.compare(password ,resultCheck.rows[0].password);

            if(passwordCheck){
                interface userInfos {
                    id: number,
                    email: string,
                    firstName: string,
                    secondName: string
                }

                const userInfos = {
                    id: resultCheck.rows[0].id,
                    firstName:  resultCheck.rows[0].firstName,
                }

                const token = jwt.sign({userInfos}, process.env.SECRET_JWT);
            
                console.log(token)
                
                // return res.status(200).json(userInfos);
                return res.cookie("access_token", token, {
                    maxAge: 86400 * 1000,
                    httpOnly: true,
                    secure: false
                }).status(200).json("Logged success");

            } else {

                return res.status(404).json('Please check your password');

            }
            
        } else {

            return res.status(403).json('Please check your email');

        }


    }catch(err) {
        // console.error(err)
        return res.status(500).json('Login failed');
    }
};

export const auth = async (req: Request, res: Response, next: any) => {
    try {
        const token = req.cookies.access_token;
        
        if(!token){
            return res.status(403).json('Not authorize')
        }
        
        
        const data : any = jwt.verify(token, process.env.SECRET_JWT)

      console.log(data.userInfos)
      console.log(data)

        req.user = {
            id: data.userInfos.id,
            firstName: data.userInfos.firstName,
        }

        return next();
        

    }catch(err) {
        return res.status(500).json('Authorization failed');
    }
}

export const logout = async (req: Request, res: Response) => {
    return res.clearCookie("access_token").status(200).json("Logout");
}

export const secure = async (req: Request, res: Response) => {   
    console.log("SECURE") 
    return res.status(200).json(req.user);
}



export const uploadUser = async (req: Request<never, never, {email: string; password:string; firstName: string; secondName: string}, never>, res: Response): Promise<Response> => {
    try {

        const { id } = req.params;

        const { firstName, secondName, password } = req.body;

        console.log(firstName, secondName, password);
       
        if(firstName !== "" && secondName === "" && password === ""){

            interface queryChange {
                text?: string,
                values?: string[],
            }

            const queryChange= {
                text: `UPDATE "users" SET "firstName" = $1, "updated_at" = CURRENT_TIMESTAMP WHERE "id" = $2 RETURNING *`,
                values: [firstName, id]
            }

            const resultCheck: QueryResult = await pool.query(queryChange);

            if(resultCheck) {

                interface queryCheckId{
                    text?: string,
                    values?: string[],
                }

                const queryCheckId= {
                    text: `SELECT * FROM "users" WHERE "id" = $1`,
                    values: [id]
                }

                const resultCheckId: QueryResult = await pool.query(queryCheckId);

                interface userInfos {
                    id: number,
                    firstName: string,
                    secondName: string
                }

                const userInfos = {
                    id: resultCheckId.rows[0].id,
                    firstName:  resultCheckId.rows[0].firstName,
                }

                const token = jwt.sign({userInfos}, process.env.SECRET_JWT);
            
                
                return res.cookie("access_token", token, {
                    maxAge: 86400 * 1000,
                    httpOnly: true,
                    secure: false
                }).status(200).json("Update success");
                
            }else {
                return res.status(403).json("Cannot change firstname");
            }

        }else if (firstName !== "" && secondName !== "" && password === ""){

            interface queryChange {
                text?: string,
                values?: string[],
            }

            const queryChange= {
                text: `UPDATE "users" SET "firstName" = $1, "secondName" = $2, "updated_at" = CURRENT_TIMESTAMP WHERE "id" = $3 RETURNING *`,
                values: [firstName, secondName, id]
            }

            const resultCheck: QueryResult = await pool.query(queryChange);

            if(resultCheck) {

                interface queryCheckId{
                    text?: string,
                    values?: string[],
                }

                const queryCheckId= {
                    text: `SELECT * FROM "users" WHERE "id" = $1`,
                    values: [id]
                }

                const resultCheckId: QueryResult = await pool.query(queryCheckId);

                interface userInfos {
                    id: number,
                    firstName: string,
                    secondName: string
                }

                const userInfos = {
                    id: resultCheckId.rows[0].id,
                    firstName:  resultCheckId.rows[0].firstName,
                }

                const token = jwt.sign({userInfos}, process.env.SECRET_JWT);
            
                
                return res.cookie("access_token", token, {
                    maxAge: 86400 * 1000,
                    httpOnly: true,
                    secure: false
                }).status(200).json("Update success");
                
            }else {
                return res.status(403).json("Cannot change firstname or secondname");
            }


        }else if (firstName !== "" && secondName !== "" && password !== ""){

            const passwordHash: any = await bcrypt.hash(password, 10);

            interface queryChange {
                text?: string,
                values?: string[],
            }

            const queryChange= {
                text: `UPDATE "users" SET "firstName" = $1, "secondName" = $2, "password" = $3, "updated_at" = CURRENT_TIMESTAMP WHERE "id" = $4 RETURNING *`,
                values: [firstName, secondName, passwordHash, id]
            }

            const resultCheck: QueryResult = await pool.query(queryChange);

            if(resultCheck) {

                interface queryCheckId{
                    text?: string,
                    values?: string[],
                }

                const queryCheckId= {
                    text: `SELECT * FROM "users" WHERE "id" = $1`,
                    values: [id]
                }

                const resultCheckId: QueryResult = await pool.query(queryCheckId);

                interface userInfos {
                    id: number,
                    firstName: string,
                    secondName: string
                }

                const userInfos = {
                    id: resultCheckId.rows[0].id,
                    firstName:  resultCheckId.rows[0].firstName,
                }

                const token = jwt.sign({userInfos}, process.env.SECRET_JWT);
            
                
                return res.cookie("access_token", token, {
                    maxAge: 86400 * 1000,
                    httpOnly: true,
                    secure: false
                }).status(200).json("Update success");
                
            }else {
                return res.status(403).json("Cannot change firstname secondname or password");
            }

        }else if (firstName === "" && secondName === "" && password !== ""){

            const passwordHash: any = await bcrypt.hash(password, 10);

            interface queryChange {
                text?: string,
                values?: string[],
            }

            const queryChange= {
                text: `UPDATE "users" SET "password" = $1, "updated_at" = CURRENT_TIMESTAMP WHERE "id" = $2 RETURNING *`,
                values: [passwordHash, id]
            }

            const resultCheck: QueryResult = await pool.query(queryChange);

            if(resultCheck) {

                interface queryCheckId{
                    text?: string,
                    values?: string[],
                }

                const queryCheckId= {
                    text: `SELECT * FROM "users" WHERE "id" = $1`,
                    values: [id]
                }

                const resultCheckId: QueryResult = await pool.query(queryCheckId);

                interface userInfos {
                    id: number,
                    firstName: string,
                    secondName: string
                }

                const userInfos = {
                    id: resultCheckId.rows[0].id,
                    firstName:  resultCheckId.rows[0].firstName,
                }

                const token = jwt.sign({userInfos}, process.env.SECRET_JWT);
            
                
                return res.cookie("access_token", token, {
                    maxAge: 86400 * 1000,
                    httpOnly: true,
                    secure: false
                }).status(200).json("Update success");
                
            }else {
                return res.status(403).json("Cannot change password");
            }
        } else {
            return res.status(200).json("nothing changed");
        }

    }catch(err) {
        console.error(err)
        return res.status(500).json('Upload failed');
    }
}
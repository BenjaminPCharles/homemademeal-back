/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Request, Response  } from "express";
import { QueryResult } from 'pg';
import { pool } from "../../db_client";
import * as bcrypt from 'bcrypt';
import * as nodemailer from "nodemailer";
import * as jwt from 'jsonwebtoken';

export const checkUsers = (req: Request, res: Response) => {
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
                await transport.sendMail({
                    from: 'Homemademeal <c72e713e5c-b76a9d+1@inbox.mailtrap.io>', // sender address
                    to: 'benake83@gmail.com', // list of receivers
                    subject: 'Activation de compte', // Subject line
                    text: 'Activation de compte', // plaintext body
                    html: `<p> Cliquez sur le lien pour activer votre compte: <a href="http://localhost:8000/confirm/${token}"> Activation </a> </p>` // html body
                });
            }
    
            return res.status(200).json(resultAdd.rows);
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

        if(!email){
            res.status(404).json('Email cannot be empty')
        }

        if(!password){
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
        console.log(resultCheck.rows[0].is_confirm)

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
                    email: resultCheck.rows[0].email,
                    firstName:  resultCheck.rows[0].firstName,
                    secondName:  resultCheck.rows[0].secondName,
                }
    
                return res.status(200).json(userInfos);

            } else {

                return res.status(404).json('Please check your password)');

            }
            
        } else {

            return res.status(404).json('Please check your email');

        }


    }catch(err) {
        console.error(err)
        return res.status(500).json('Login failed');
    }
};

export const uploadUser = async (req: Request<never, never, {email: string; password:string; firstName: string; secondName: string}, never>, res: Response): Promise<Response> => {
    try {

        const { id } = req.params;

        const { firstName, secondName } = req.body;

        interface queryChange {
            text?: string,
            values?: string[],
        }

        const queryChange= {
            text: `UPDATE "users" SET "firstName" = $1, "secondName" = $2, "updated_at" = CURRENT_TIMESTAMP WHERE "id" = $3 RETURNING *`,
            values: [firstName, secondName, id]
        }


        const resultCheck: QueryResult = await pool.query(queryChange);

        return res.status(200).json(resultCheck.rows);




    }catch(err) {
        console.error(err)
        return res.status(500).json('Upload failed');
    }
}
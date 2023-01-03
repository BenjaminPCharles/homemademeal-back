import { QueryResult } from 'pg';
import { pool } from "../../db_client";

export const getAllUserReciptes = async (user_id:number):Promise<any> => {

    console.log(user_id)
    console.log(typeof user_id)
    
    interface queryGetAllUser {
        text?: string,
        values?: number[]
    }

    const queryGetAllUser = {
        text: 'SELECT * FROM "receipts" WHERE user_id = $1',
        values: [user_id]
    }

    const resultgetAllUser: QueryResult = await pool.query(queryGetAllUser);

    return resultgetAllUser.rows;
};


export const deleteUserReciptes = async (id:number):Promise<any> => {
    interface queryDeleteUserReceipt {
        text?: string,
        values?: number[]
    }

    const queryDeleteUserReceipt = {
        text: 'DELETE FROM "receipts" WHERE id = $1',
        values: [id]
    }

    const resultDeleteUserReceipt: QueryResult = await pool.query(queryDeleteUserReceipt);

    return resultDeleteUserReceipt.rows;
};


export const addUserRecipt = async (name: string, step: string[] ,user_id:number):Promise<any> => {

    console.log({ name, step ,user_id })

    interface queryDeleteReceipt {
        text?: string,
        values?: (string | number | string[])[]
    }

    const queryDeleteReceipt = {
        text: 'INSERT INTO "receipts" (name, step ,user_id) VALUES ($1, array[$2], $3) RETURNING *',
        values: [name, step ,user_id]
    }

    const resultDelete: QueryResult = await pool.query(queryDeleteReceipt);

    return resultDelete.rows;
}
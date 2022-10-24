import { QueryResult } from 'pg';
import { pool } from "../../db_client";

export const getAllUserReciptes = async (user_id:number):Promise<any> => {
    interface queryGetAllUser {
        text?: string,
        values?: number[]
    }

    const queryGetAllUser = {
        text: 'SELECT * FROM "recipes" WHERE user_id = $1',
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
        text: 'DELETE FROM "recipes" WHERE id = $1',
        values: [id]
    }

    const resultDeleteUserReceipt: QueryResult = await pool.query(queryDeleteUserReceipt);

    return resultDeleteUserReceipt.rows;
};


export const addUserRecipt = async (name: string, user_id:number):Promise<any> => {
    interface queryDeleteReceipt {
        text?: string,
        values?: (string | number)[]
    }

    const queryDeleteReceipt = {
        text: 'INSERT INTO "recipes" (name, user_id) VALUES ($1, $2) RETURNING *',
        values: [name, user_id]
    }

    const resultDelete: QueryResult = await pool.query(queryDeleteReceipt);

    return resultDelete.rows;
}
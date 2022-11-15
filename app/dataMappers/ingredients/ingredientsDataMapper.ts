import { QueryResult } from 'pg';
import { pool } from "../../db_client";

export const addIngredient = async ( name:string, unity: string, unity_number: number, is_important:boolean, user_id:number): Promise<any> => {

    interface queryAdd {
        text?: string,
        values?: (string|number|boolean)[],
    }

    const queryAdd = {
        text: `INSERT INTO "ingredients" (name, unity, unity_number, is_important, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        values: [name, unity, unity_number, is_important, user_id]
    };

    const resultAdd: QueryResult = await pool.query(queryAdd);

    return resultAdd.rows;
}

export const getAllIngredient = async (user_id: number): Promise<any> => {
    interface queryGetAll {
        text?: string
        values?: number[]
    }

    const queryGetAll = {
        text: 'SELECT * FROM "ingredients" WHERE "user_id" = $1',
        values: [user_id]
    }

    const resultGetAll: QueryResult = await pool.query(queryGetAll);

    return resultGetAll.rows;
}

export const deleteIngredient = async (id:number): Promise<any> => {
    interface queryDeleteIngredient {
        text?: string,
        values?: number[]
    }

    const queryDeleteIngredient = {
        text: 'DELETE FROM "ingredients" WHERE "id" = $1',
        values: [id]
    }

    const resultDelete: QueryResult = await pool.query(queryDeleteIngredient);

    return resultDelete.rows;
}
import { Request, Response  } from "express";

import { getAllUserReciptes, deleteUserReciptes, addUserRecipt } from "../../dataMappers/reciptes/reciptesDataMapper";

export const checkReciptes = (req: Request, res: Response) => {
    res.send("Reciptes")
}

export const getAllByUserController = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.params;

        const resultGetAll = await getAllUserReciptes(Number(user_id));

        return res.status(200).json(resultGetAll)

    }catch(err){
        return res.status(500).json("GetAllByUser failed");
    }
}

export const deleteReceiptController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const resultDelete = await deleteUserReciptes(Number(id));

        return res.status(200).json(resultDelete)

    }catch(err){
        return res.status(500).json("Delete receipt failed");
    }
}

export const addReciptController = async (req:Request<never, never, {name:string; user_id:number;},never>, res: Response ) => {
    try {
        const { name, user_id } = req.body;

        if(!name) {
            res.status(404).json("Name cannot be empty");
        }
        if(!user_id) {
            res.status(404).json("User id cannot be empty");
        }

        const result = await addUserRecipt(name, Number(user_id));

        return res.status(200).json(result)

    }catch(err){
        return res.status(500).json("Add receipt failed")
    }
}



import { Request, Response  } from "express";

import { addIngredient, getAllIngredient, deleteIngredient } from "../../dataMappers/ingredients/ingredientsDataMapper";

export const checkIngredients = (req: Request, res: Response) => {
    res.send("Ingredients")
}

export const addController = async (req: Request<never, never, { name: string; unity: string; unity_number:number; is_important:boolean; user_id:number; }, never>, res: Response) => {
    try {
        const { name, unity, unity_number, is_important, user_id } = req.body;

        if(!name){
            res.status(404).json('Name cannot be empty')
        }
        if(!unity){
            res.status(404).json('Unity cannot be empty')
        }
        if(!unity_number){
            res.status(404).json('Unity_number cannot be empty')
        }
        if(!is_important){
            res.status(404).json('Is_important cannot be empty')
        }
        if(!user_id){
            res.status(404).json('User_id cannot be empty')
        }

        const result = await addIngredient(name, unity, unity_number, is_important, user_id);

        return res.status(200).json(result);


    }catch(err){
        return res.status(500).json('Sign up failed');
    }
}

export const getAllController = async (req: Request, res:Response) => {
    try {
        const { user_id } = req.params;
        //Attention au type de userId
        const result = await getAllIngredient(Number(user_id));

        return res.status(200).json(result);
    }catch(err){
        return res.status(500).json("Get all ingredients failed");
    }
}

export const deleteController = async ( req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await deleteIngredient(Number(id));

        return res.status(200).json(result);
    }catch(err){
        return res.status(500).json("Delete ingredient failed");
    }
}
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import cors from 'cors';

const router = Router();

// Import controllers
import { checkIngredients, addController, getAllController, deleteController } from './controllers/ingredients/ingredientsController';
import { checkReciptes, getAllByUserController, deleteReceiptController, addReciptController } from './controllers/reciptes/reciptesController';
import { checkUsers, signUp, confirm, login, auth, logout, secure, uploadUser } from './controllers/users/usersController';


// Users route
router.get('/', checkUsers);
router.post('/api/v1/signup', signUp);
router.patch('/api/v1/confirm/:id', confirm);
router.post('/api/v1/login',login);
router.patch('/api/v1/user/:id', auth ,uploadUser);

router.get('/api/v1/logout',auth, logout);
router.get('/api/v1/secure', auth, secure);

// Rajouter une route delete


import passport from "passport";

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      session: true
    }),
    (req, res) => {
        return res.status(200).json(req.user);
    }
);



// Reciptes route
// router.get('/', checkReciptes);
router.get('/api/v1/getAllReceiptsByUser', getAllByUserController)
router.post('/api/v1/addReceipt', addReciptController);
router.delete('/api/v1/deleteReceipt/:id', deleteReceiptController);

// Ingredients route
// router.get('/', checkIngredients);
router.post('/api/v1/addIngredient', addController);
router.get('/api/v1/getAllIngredient/:user_id', getAllController);
router.delete('/api/v1/deleteIngredient/:id', deleteController);


export default router;


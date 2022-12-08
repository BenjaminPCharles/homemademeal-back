/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import cors from 'cors';

import * as jwt from 'jsonwebtoken';

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

router.get("/google/login", (req: any, res) => {
  console.log(req.user)

  const userInfos = req.user

  //Rajouter un googleAuth true a userInfos
  const token = jwt.sign({userInfos}, process.env.SECRET_JWT);

  return res.cookie("access_token", token, {
    maxAge: 86400 * 1000,
    httpOnly: true,
    secure: false
  }).status(200).json("Logged success");
});


router.get(
  "/auth/google", cors(),
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      session: true,
      successRedirect: "http://localhost:5173/google/auth"
    })
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


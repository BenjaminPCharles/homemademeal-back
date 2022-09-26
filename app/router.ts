/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';

const router = Router();

// Import controllers
import { checkIngredients } from './controllers/ingredients/ingredientsController';
import { checkReciptes } from './controllers/reciptes/reciptesController';
import { checkUsers, signUp, confirm, login, uploadUser } from './controllers/users/usersController';

// Users route
router.get('/', checkUsers);
router.post('/signup', signUp);
router.patch('/confirm/:id', confirm);
router.post('/login', login);
router.patch('/user/:id', uploadUser);


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





// Rajouter une route delete

// Reciptes route
router.get('/', checkReciptes);

// Ingredients route
router.get('/', checkIngredients);


export default router;


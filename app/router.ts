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
// Rajouter une route delete

// Reciptes route
router.get('/', checkReciptes);

// Ingredients route
router.get('/', checkIngredients);


export default router;


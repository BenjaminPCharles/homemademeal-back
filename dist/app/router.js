"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = require("express");
const cors_1 = __importDefault(require("cors"));
const router = (0, express_1.Router)();
// Import controllers
const ingredientsController_1 = require("./controllers/ingredients/ingredientsController");
const reciptesController_1 = require("./controllers/reciptes/reciptesController");
const usersController_1 = require("./controllers/users/usersController");
// Users route
router.get('/', usersController_1.checkUsers);
router.post('/api/v1/signup', (0, cors_1.default)(), usersController_1.signUp);
router.patch('/api/v1/confirm/:id', (0, cors_1.default)(), usersController_1.confirm);
router.post('/api/v1/login', usersController_1.login);
router.patch('/api/v1/user/:id', usersController_1.uploadUser);
// Rajouter une route delete
const passport_1 = __importDefault(require("passport"));
router.get("/auth/google", passport_1.default.authenticate("google", {
    scope: ["email", "profile"],
}));
router.get("/auth/google/callback", passport_1.default.authenticate("google", {
    session: true
}), (req, res) => {
    return res.status(200).json(req.user);
});
// Reciptes route
router.get('/', reciptesController_1.checkReciptes);
router.get('/api/v1/getAllReceiptsByUser', reciptesController_1.getAllByUserController);
router.post('/api/v1/addReceipt', reciptesController_1.addReciptController);
router.delete('/api/v1/deleteReceipt/:id', reciptesController_1.deleteReceiptController);
// Ingredients route
router.get('/', ingredientsController_1.checkIngredients);
router.post('/api/v1/addIngredient', ingredientsController_1.addController);
router.get('/api/v1/getAllIngredient/:user_id', ingredientsController_1.getAllController);
router.delete('/api/v1/deleteIngredient/:id', ingredientsController_1.deleteController);
exports.default = router;

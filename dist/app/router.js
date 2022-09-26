"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = require("express");
const router = (0, express_1.Router)();
// Import controllers
const ingredientsController_1 = require("./controllers/ingredients/ingredientsController");
const reciptesController_1 = require("./controllers/reciptes/reciptesController");
const usersController_1 = require("./controllers/users/usersController");
// Users route
router.get('/', usersController_1.checkUsers);
router.post('/signup', usersController_1.signUp);
router.patch('/confirm/:id', usersController_1.confirm);
router.post('/login', usersController_1.login);
router.patch('/user/:id', usersController_1.uploadUser);
const passport_1 = __importDefault(require("passport"));
router.get("/auth/google", passport_1.default.authenticate("google", {
    scope: ["email", "profile"],
}));
router.get("/auth/google/callback", passport_1.default.authenticate("google", {
    session: true
}), (req, res) => {
    return res.status(200).json(req.user);
});
// Rajouter une route delete
// Reciptes route
router.get('/', reciptesController_1.checkReciptes);
// Ingredients route
router.get('/', ingredientsController_1.checkIngredients);
exports.default = router;

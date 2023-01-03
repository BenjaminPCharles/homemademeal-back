"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = require("express");
const cors_1 = __importDefault(require("cors"));
const jwt = __importStar(require("jsonwebtoken"));
const router = (0, express_1.Router)();
// Import controllers
const ingredientsController_1 = require("./controllers/ingredients/ingredientsController");
const reciptesController_1 = require("./controllers/reciptes/reciptesController");
const usersController_1 = require("./controllers/users/usersController");
// Users route
router.get('/', usersController_1.checkUsers);
router.post('/api/v1/signup', usersController_1.signUp);
router.patch('/api/v1/confirm/:id', usersController_1.confirm);
router.post('/api/v1/login', usersController_1.login);
router.patch('/api/v1/user/:id', usersController_1.auth, usersController_1.uploadUser);
router.get('/api/v1/logout', usersController_1.auth, usersController_1.logout);
router.get('/api/v1/secure', usersController_1.auth, usersController_1.secure);
// Rajouter une route delete
const passport_1 = __importDefault(require("passport"));
router.get("/google/login", (req, res) => {
    console.log(req.user);
    const userInfos = req.user;
    //Rajouter un googleAuth true a userInfos
    const token = jwt.sign({ userInfos }, process.env.SECRET_JWT);
    return res.cookie("access_token", token, {
        maxAge: 86400 * 1000,
        httpOnly: true,
        secure: false
    }).status(200).json("Logged success");
});
router.get("/auth/google", (0, cors_1.default)(), passport_1.default.authenticate("google", {
    scope: ["email", "profile"],
}));
router.get("/auth/google/callback", passport_1.default.authenticate("google", {
    session: true,
    successRedirect: "http://localhost:5173/google/auth"
}));
// Reciptes route
// router.get('/', checkReciptes);
router.get('/api/v1/getAllReceiptsByUser/:user_id', reciptesController_1.getAllByUserController);
router.post('/api/v1/addReceipt', reciptesController_1.addReciptController);
router.delete('/api/v1/deleteReceipt/:id', reciptesController_1.deleteReceiptController);
// Ingredients route
// router.get('/', checkIngredients);
router.post('/api/v1/addIngredient', ingredientsController_1.addController);
router.get('/api/v1/getAllIngredient/:user_id', ingredientsController_1.getAllController);
router.delete('/api/v1/deleteIngredient/:id', ingredientsController_1.deleteController);
exports.default = router;

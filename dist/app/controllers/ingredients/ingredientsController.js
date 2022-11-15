"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteController = exports.getAllController = exports.addController = exports.checkIngredients = void 0;
const ingredientsDataMapper_1 = require("../../dataMappers/ingredients/ingredientsDataMapper");
const checkIngredients = (req, res) => {
    res.send("Ingredients");
};
exports.checkIngredients = checkIngredients;
const addController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, unity, unity_number, is_important, user_id } = req.body;
        if (!name) {
            res.status(404).json('Name cannot be empty');
        }
        if (!unity) {
            res.status(404).json('Unity cannot be empty');
        }
        if (!unity_number) {
            res.status(404).json('Unity_number cannot be empty');
        }
        if (!is_important) {
            res.status(404).json('Is_important cannot be empty');
        }
        if (!user_id) {
            res.status(404).json('User_id cannot be empty');
        }
        const result = yield (0, ingredientsDataMapper_1.addIngredient)(name, unity, unity_number, is_important, user_id);
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(500).json('Sign up failed');
    }
});
exports.addController = addController;
const getAllController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        //Attention au type de userId
        const result = yield (0, ingredientsDataMapper_1.getAllIngredient)(Number(user_id));
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(500).json("Get all ingredients failed");
    }
});
exports.getAllController = getAllController;
const deleteController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield (0, ingredientsDataMapper_1.deleteIngredient)(Number(id));
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(500).json("Delete ingredient failed");
    }
});
exports.deleteController = deleteController;

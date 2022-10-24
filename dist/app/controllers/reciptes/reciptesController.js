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
exports.addReciptController = exports.deleteReceiptController = exports.getAllByUserController = exports.checkReciptes = void 0;
const reciptesDataMapper_1 = require("../../dataMappers/reciptes/reciptesDataMapper");
const checkReciptes = (req, res) => {
    res.send("Reciptes");
};
exports.checkReciptes = checkReciptes;
const getAllByUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        const resultGetAll = yield (0, reciptesDataMapper_1.getAllUserReciptes)(Number(user_id));
        return res.status(200).json(resultGetAll);
    }
    catch (err) {
        return res.status(500).json("GetAllByUser failed");
    }
});
exports.getAllByUserController = getAllByUserController;
const deleteReceiptController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const resultDelete = yield (0, reciptesDataMapper_1.deleteUserReciptes)(Number(id));
        return res.status(200).json(resultDelete);
    }
    catch (err) {
        return res.status(500).json("Delete receipt failed");
    }
});
exports.deleteReceiptController = deleteReceiptController;
const addReciptController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, user_id } = req.body;
        if (!name) {
            res.status(404).json("Name cannot be empty");
        }
        if (!user_id) {
            res.status(404).json("User id cannot be empty");
        }
        const result = yield (0, reciptesDataMapper_1.addUserRecipt)(name, Number(user_id));
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(500).json("Add receipt failed");
    }
});
exports.addReciptController = addReciptController;

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
exports.deleteIngredient = exports.getAllIngredient = exports.addIngredient = void 0;
const db_client_1 = require("../../db_client");
const addIngredient = (name, unity, unity_number, is_important, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const queryAdd = {
        text: `INSERT INTO "ingredients" (name, unity, unity_number, is_important, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        values: [name, unity, unity_number, is_important, user_id]
    };
    const resultAdd = yield db_client_1.pool.query(queryAdd);
    return resultAdd.rows;
});
exports.addIngredient = addIngredient;
const getAllIngredient = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const queryGetAll = {
        text: 'SELECT * FROM "ingredients" WHERE "user_id" = $1',
        values: [user_id]
    };
    const resultGetAll = yield db_client_1.pool.query(queryGetAll);
    return resultGetAll.rows;
});
exports.getAllIngredient = getAllIngredient;
const deleteIngredient = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const queryDeleteIngredient = {
        text: 'DELETE FROM "ingredients" WHERE "id" = $1',
        values: [id]
    };
    const resultDelete = yield db_client_1.pool.query(queryDeleteIngredient);
    return resultDelete.rows;
});
exports.deleteIngredient = deleteIngredient;

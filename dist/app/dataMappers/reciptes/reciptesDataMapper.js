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
exports.addUserRecipt = exports.deleteUserReciptes = exports.getAllUserReciptes = void 0;
const db_client_1 = require("../../db_client");
const getAllUserReciptes = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const queryGetAllUser = {
        text: 'SELECT * FROM "recipes" WHERE user_id = $1',
        values: [user_id]
    };
    const resultgetAllUser = yield db_client_1.pool.query(queryGetAllUser);
    return resultgetAllUser.rows;
});
exports.getAllUserReciptes = getAllUserReciptes;
const deleteUserReciptes = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const queryDeleteUserReceipt = {
        text: 'DELETE FROM "recipes" WHERE id = $1',
        values: [id]
    };
    const resultDeleteUserReceipt = yield db_client_1.pool.query(queryDeleteUserReceipt);
    return resultDeleteUserReceipt.rows;
});
exports.deleteUserReciptes = deleteUserReciptes;
const addUserRecipt = (name, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const queryDeleteReceipt = {
        text: 'INSERT INTO "recipes" (name, user_id) VALUES ($1, $2) RETURNING *',
        values: [name, user_id]
    };
    const resultDelete = yield db_client_1.pool.query(queryDeleteReceipt);
    return resultDelete.rows;
});
exports.addUserRecipt = addUserRecipt;

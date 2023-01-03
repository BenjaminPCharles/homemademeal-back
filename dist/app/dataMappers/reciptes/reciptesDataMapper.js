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
    console.log(user_id);
    console.log(typeof user_id);
    const queryGetAllUser = {
        text: 'SELECT * FROM "receipts" WHERE user_id = $1',
        values: [user_id]
    };
    const resultgetAllUser = yield db_client_1.pool.query(queryGetAllUser);
    return resultgetAllUser.rows;
});
exports.getAllUserReciptes = getAllUserReciptes;
const deleteUserReciptes = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const queryDeleteUserReceipt = {
        text: 'DELETE FROM "receipts" WHERE id = $1',
        values: [id]
    };
    const resultDeleteUserReceipt = yield db_client_1.pool.query(queryDeleteUserReceipt);
    return resultDeleteUserReceipt.rows;
});
exports.deleteUserReciptes = deleteUserReciptes;
const addUserRecipt = (name, step, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ name, step, user_id });
    const queryDeleteReceipt = {
        text: 'INSERT INTO "receipts" (name, step ,user_id) VALUES ($1, array[$2], $3) RETURNING *',
        values: [name, step, user_id]
    };
    const resultDelete = yield db_client_1.pool.query(queryDeleteReceipt);
    return resultDelete.rows;
});
exports.addUserRecipt = addUserRecipt;
